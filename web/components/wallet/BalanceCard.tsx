"use client"

import { DollarSign, RefreshCw } from "lucide-react"

interface BalanceCardProps {
  balance?: number
  isLoading: boolean
  onRefresh?: () => void
}

export function BalanceCard({ balance, isLoading, onRefresh }: BalanceCardProps) {
  // Format balance helper
  const formatBalance = (amount?: number) => {
    if (amount === undefined) return "0.00"
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-outline-variant/60 bg-white/95 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8 transition-all hover:shadow-[0_22px_60px_rgba(17,28,45,0.1)]">
      {/* Accent gradient ribbon at the top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-blue-500 to-indigo-600" />

      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <DollarSign className="h-6 w-6" />
        </div>
        
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-variant/40 hover:text-on-surface transition-colors disabled:opacity-50"
            title="Refresh balance"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      <div className="mt-6">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
          USDC Balance
        </span>
        
        {isLoading ? (
          <div className="mt-3 space-y-2 animate-pulse">
            <div className="h-9 w-32 rounded-lg bg-surface-variant/40" />
            <div className="h-4 w-20 rounded-lg bg-surface-variant/20" />
          </div>
        ) : (
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
              ${formatBalance(balance)}
            </span>
            <span className="text-sm font-semibold text-primary">
              USDC
            </span>
          </div>
        )}
      </div>

      {!isLoading && (
        <div className="mt-6 flex items-center justify-between border-t border-outline-variant/30 pt-4 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Stellar testnet balance active
          </span>
        </div>
      )}
    </div>
  )
}
