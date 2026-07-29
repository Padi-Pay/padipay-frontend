import React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BalanceCard } from "../components/wallet/BalanceCard"

describe("BalanceCard Component", () => {
  it("renders the loading skeleton when isLoading is true", () => {
    render(<BalanceCard isLoading={true} />)
    
    expect(screen.getByText("USDC Balance")).toBeInTheDocument()
    // It should not show the balance symbol or testnet status
    expect(screen.queryByText("USDC")).not.toBeInTheDocument()
    expect(screen.queryByText(/Stellar testnet balance active/i)).not.toBeInTheDocument()
  })

  it("renders balance with USD grouping separator decimals when isLoading is false", () => {
    render(<BalanceCard balance={14589.6} isLoading={false} />)

    expect(screen.getByText("USDC Balance")).toBeInTheDocument()
    expect(screen.getByText("$14,589.60")).toBeInTheDocument()
    expect(screen.getByText("USDC")).toBeInTheDocument()
    expect(screen.getByText(/Stellar testnet balance active/i)).toBeInTheDocument()
  })

  it("handles null or zero balance elegantly", () => {
    const { rerender } = render(<BalanceCard balance={0} isLoading={false} />)
    expect(screen.getByText("$0.00")).toBeInTheDocument()

    rerender(<BalanceCard balance={undefined} isLoading={false} />)
    expect(screen.getByText("$0.00")).toBeInTheDocument()
  })

  it("triggers onRefresh callback when reload button is pressed", async () => {
    const user = userEvent.setup()
    const handleRefresh = vi.fn()

    render(
      <BalanceCard balance={100} isLoading={false} onRefresh={handleRefresh} />
    )

    const refreshBtn = screen.getByTitle("Refresh balance")
    expect(refreshBtn).toBeInTheDocument()

    await user.click(refreshBtn)
    expect(handleRefresh).toHaveBeenCalledOnce()
  })
})
