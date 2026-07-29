"use client"

import { useState } from "react"
import { Modal } from "../ui/Modal"
import { useApi } from "../../src/hooks/useApi"
import { toast } from "sonner"
import { Coins, Loader2, Info } from "lucide-react"

interface FundModalProps {
  isOpen: boolean
  onClose: () => void
  mutateBalance: () => Promise<any>
}

export function FundModal({ isOpen, onClose, mutateBalance }: FundModalProps) {
  const { request, isLoading } = useApi<{ success: boolean; message?: string }>()
  
  const handleRequestFunds = async () => {
    const { data, error } = await request({
      url: "/api/wallets/fund",
      method: "POST",
    })

    if (!error) {
      toast.success("Funding request successful! Testnet USDC has been added to your wallet.")
      // Re-fetch the balance immediately
      await mutateBalance()
      onClose()
    } else {
      // SWR/useApi handles global toast error, but let's add context if needed
      console.error("Funding error details:", error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fund Wallet (Stellar Testnet)">
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-xl bg-primary/5 p-4 border border-primary/10">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/80 leading-relaxed">
            <p className="font-semibold text-primary mb-1">Simulated Liquidity (Phase 2)</p>
            Because this is currently running on the Stellar Testnet, you can top-up your wallet using the testnet faucet. This simulates a real USDC transfer.
          </div>
        </div>

        <div className="text-center py-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 mb-4 animate-bounce">
            <Coins className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Request Testnet USDC</h3>
          <p className="mt-2 text-sm text-on-surface-variant max-w-sm mx-auto">
            Click the button below to request <span className="font-semibold text-foreground">1,000.00 USDC</span> from the Stellar testnet faucet.
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-surface-variant/40 text-on-surface transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleRequestFunds}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-primary text-on-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Communicating with Faucet...
              </>
            ) : (
              "Request Testnet USDC"
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}
