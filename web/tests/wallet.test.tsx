import React from "react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { server } from "./setup"
import { http, HttpResponse } from "msw"
import { toast } from "sonner"
import WalletView from "../app/dashboard/wallet"
import { useWallet } from "../hooks/useWallet"
import { SWRConfig } from "swr"

// Mock Toast manager
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      {children}
    </SWRConfig>
  )
}

describe("Wallet Experience Epic Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("loads and displays USDC balance and public address badge", async () => {
    server.use(
      http.get("*/api/wallets/me", () => {
        return HttpResponse.json({
          address: "GC3O2B2XUHRT5S3H6K3L4X4D2QW7O2M3E2J7X7O2R2T2A2B2V2W2Y2Q2",
          balance: 1450.75,
        })
      })
    )

    render(
      <TestWrapper>
        <WalletView />
      </TestWrapper>
    )

    // Verify skeleton loader while fetching
    expect(screen.getByText("USDC Balance")).toBeInTheDocument()

    // Wait for balance and address badge to appear
    await waitFor(() => {
      expect(screen.getByText("$1,450.75")).toBeInTheDocument()
      expect(screen.getByText("GC3O2B...Y2Q2")).toBeInTheDocument()
    })
  })

  it("handles loading failure and displays API network warning", async () => {
    server.use(
      http.get("*/api/wallets/me", () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    render(
      <TestWrapper>
        <WalletView />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText(/Failed to sync with Stellar node/i)).toBeInTheDocument()
    })
  })

  it("validates funding modal faucet top-up click triggers mutation", async () => {
    const user = userEvent.setup()
    let initialBalance = 250.00

    server.use(
      http.get("*/api/wallets/me", () => {
        return HttpResponse.json({
          address: "GC3O2B2XUHRT5S3H6K3L4X4D2QW7O2M3E2J7X7O2R2T2A2B2V2W2Y2Q2",
          balance: initialBalance,
        })
      }),
      http.post("*/api/wallets/fund", () => {
        initialBalance = 1250.00
        return HttpResponse.json({ success: true })
      })
    )

    render(
      <TestWrapper>
        <WalletView />
      </TestWrapper>
    )

    // Wait for data load
    await waitFor(() => {
      expect(screen.getByText("$250.00")).toBeInTheDocument()
    })

    // Open Fund Modal
    await user.click(screen.getByRole("button", { name: /Fund Wallet/i }))

    // Faucet instruction check
    expect(screen.getByText(/Request Testnet USDC/i)).toBeInTheDocument()

    // Request coins
    await user.click(screen.getByRole("button", { name: "Request Testnet USDC" }))

    // Check loading indicator and SWR mutate call triggers balance renewal
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("Funding request successful")
      )
      expect(screen.getByText("$1,250.00")).toBeInTheDocument()
    })
  })

  it("enforces client-side validation on withdrawal amounts and Stellar addresses", async () => {
    const user = userEvent.setup()
    
    server.use(
      http.get("*/api/wallets/me", () => {
        return HttpResponse.json({
          address: "GC3O2B2XUHRT5S3H6K3L4X4D2QW7O2M3E2J7X7O2R2T2A2B2V2W2Y2Q2",
          balance: 300.00,
        })
      }),
      http.post("*/api/wallets/withdraw", () => {
        return HttpResponse.json({ success: true })
      })
    )

    render(
      <TestWrapper>
        <WalletView />
      </TestWrapper>
    )

    await waitFor(() => {
      expect(screen.getByText("$300.00")).toBeInTheDocument()
    })

    // Open Withdraw Modal
    await user.click(screen.getByRole("button", { name: /Withdraw Funds/i }))

    expect(screen.getByText("Available to Withdraw")).toBeInTheDocument()
    
    const withdrawBtn = screen.getByRole("button", { name: "Withdraw USDC" })
    const addressInput = screen.getByLabelText(/Destination Stellar Address/i)
    const amountInput = screen.getByLabelText(/Amount \(USDC\)/i)

    // 1. Submit empty - triggers form validations
    await user.click(withdrawBtn)
    await waitFor(() => {
      expect(screen.getByText("Address must be exactly 56 characters")).toBeInTheDocument()
    })

    // 2. Submit wrong address format - G-start validation and length checks
    await user.clear(addressInput)
    await user.type(addressInput, "BADADDRESS321")
    await user.clear(amountInput)
    await user.type(amountInput, "200")
    await user.click(withdrawBtn)
    await waitFor(() => {
      expect(screen.getByText("Address must be exactly 56 characters")).toBeInTheDocument()
    })

    // Type 56 starting with bad letter
    await user.clear(addressInput)
    await user.type(addressInput, "S" + "A".repeat(55))
    await user.click(withdrawBtn)
    await waitFor(() => {
      expect(screen.getByText("Address must start with 'G'")).toBeInTheDocument()
    })

    // 3. Submit amount > balance error check
    await user.clear(addressInput)
    await user.type(addressInput, "G" + "A".repeat(55))
    await user.clear(amountInput)
    await user.type(amountInput, "450") // 450 > 300
    await user.click(withdrawBtn)
    await waitFor(() => {
      expect(screen.getByText("Insufficient balance. Available is $300")).toBeInTheDocument()
    })

    // 4. Submit correct details
    await user.clear(amountInput)
    await user.type(amountInput, "150.50")
    
    // Blur to format
    fireEvent.blur(amountInput)

    await user.click(withdrawBtn)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("Withdrawal initiated successfully")
      )
    })
  })
})
