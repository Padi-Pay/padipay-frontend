import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { WithdrawModal } from "../components/wallet/WithdrawModal"
import { useApi } from "../src/hooks/useApi"

// Mock useApi
vi.mock("../src/hooks/useApi", () => ({
  useApi: vi.fn(),
}))

describe("WithdrawModal Component Unit Tests", () => {
  const mockMutateBalance = vi.fn()
  const mockOnClose = vi.fn().mockImplementation(() => {})
  const mockRequest = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useApi).mockReturnValue({
      request: mockRequest,
      isLoading: false,
      data: null,
      error: null,
    } as any)
  })

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <WithdrawModal
        isOpen={false}
        onClose={mockOnClose}
        availableBalance={500}
        mutateBalance={mockMutateBalance}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it("renders balance message and forms fields when open", () => {
    render(
      <WithdrawModal
        isOpen={true}
        onClose={mockOnClose}
        availableBalance={750.5}
        mutateBalance={mockMutateBalance}
      />
    )

    expect(screen.getByText("Withdraw Funds")).toBeInTheDocument()
    expect(screen.getByText("$750.50 USDC")).toBeInTheDocument()
    expect(screen.getByLabelText(/Destination Stellar Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Amount \(USDC\)/i)).toBeInTheDocument()
  })

  it("shows error for negative amount or invalid address on submit", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <WithdrawModal
        isOpen={true}
        onClose={mockOnClose}
        availableBalance={100}
        mutateBalance={mockMutateBalance}
      />
    )

    const addressInput = screen.getByLabelText(/Destination Stellar Address/i)
    const submitBtn = screen.getByRole("button", { name: "Withdraw USDC" })

    // Inputs: malformed address and amount
    await user.type(addressInput, "G1234")
    
    // Set hidden amount directly to bypass UI keyboard filter
    const hiddenAmountInput = container.querySelector("input[name='amount']") as HTMLInputElement
    fireEvent.change(hiddenAmountInput, { target: { value: "-5.5" } })

    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText("Address must be exactly 56 characters")).toBeInTheDocument()
      expect(screen.getByText("Amount must be greater than zero")).toBeInTheDocument()
    })

    expect(mockRequest).not.toHaveBeenCalled()
  })

  it("enforces maximum available balance constraint limit", async () => {
    const user = userEvent.setup()
    render(
      <WithdrawModal
        isOpen={true}
        onClose={mockOnClose}
        availableBalance={200}
        mutateBalance={mockMutateBalance}
      />
    )

    const addressInput = screen.getByLabelText(/Destination Stellar Address/i)
    const amountInput = screen.getByLabelText(/Amount \(USDC\)/i)
    const submitBtn = screen.getByRole("button", { name: "Withdraw USDC" })

    // Input G + 55 chars
    await user.type(addressInput, "G" + "A".repeat(55))
    await user.type(amountInput, "200.01") // Exceeds balance!
    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText("Insufficient balance. Available is $200")).toBeInTheDocument()
    })

    expect(mockRequest).not.toHaveBeenCalled()
  })

  it("submits correct form values and triggers onClose and mutateBalance on success", async () => {
    const user = userEvent.setup()
    mockRequest.mockResolvedValue({ data: { success: true }, error: null })

    render(
      <WithdrawModal
        isOpen={true}
        onClose={mockOnClose}
        availableBalance={1000}
        mutateBalance={mockMutateBalance}
      />
    )

    const addressInput = screen.getByLabelText(/Destination Stellar Address/i)
    const amountInput = screen.getByLabelText(/Amount \(USDC\)/i)
    const submitBtn = screen.getByRole("button", { name: "Withdraw USDC" })

    await user.type(addressInput, "G" + "B".repeat(55))
    await user.type(amountInput, "500")
    
    // Blur to format
    fireEvent.blur(amountInput)

    await user.click(submitBtn)

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledWith({
        url: "/api/wallets/withdraw",
        method: "POST",
        data: {
          destinationAddress: "G" + "B".repeat(55),
          amount: 500,
        },
      })
      expect(mockMutateBalance).toHaveBeenCalledOnce()
      expect(mockOnClose).toHaveBeenCalledOnce()
    })
  })
})
