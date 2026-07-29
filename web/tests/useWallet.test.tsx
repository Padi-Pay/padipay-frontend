import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useWallet } from "../hooks/useWallet"
import { server } from "./setup"
import { http, HttpResponse } from "msw"
import { SWRConfig } from "swr"

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      {children}
    </SWRConfig>
  )
}

describe("useWallet Hook SWR Lifecycles", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("handles loading states and returns wallet data payload details", async () => {
    server.use(
      http.get("*/api/wallets/me", () => {
        return HttpResponse.json({
          address: "GAAAABBBBCCCCDDDD",
          balance: 99.45,
        })
      })
    )

    const { result } = renderHook(() => useWallet(), { wrapper: TestWrapper })

    // Initially loading state
    expect(result.current.isLoading).toBe(true)

    // Wait for resolution
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.wallet).toEqual({
      address: "GAAAABBBBCCCCDDDD",
      balance: 99.45,
    })
    expect(result.current.error).toBeUndefined()
  })

  it("exposes SWR error state when backend service fails", async () => {
    server.use(
      http.get("*/api/wallets/me", () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    const { result } = renderHook(() => useWallet(), { wrapper: TestWrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    }, { timeout: 5000 })

    expect(result.current.wallet).toBeUndefined()
    expect(result.current.error).toBeDefined()
  })
})
