"use client"

import { useState } from "react"
import { useWallet } from "../../hooks/useWallet"
import { BalanceCard } from "../../components/wallet/BalanceCard"
import { WalletBadge } from "../../components/domain/WalletBadge"
import { FundModal } from "../../components/wallet/FundModal"
import { WithdrawModal } from "../../components/wallet/WithdrawModal"
import { 
  Plus, 
  ArrowUpRight, 
  Wallet, 
  ArrowRightLeft, 
  History, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock 
} from "lucide-react"

// Beautiful modern mock transactions to give a rich wallet UX experience
const MOCK_TRANSACTIONS = [
  {
    id: "tx_01",
    type: "deposit",
    amount: 1000.00,
    timestamp: "10 mins ago",
    status: "success",
    address: "GDHW...L2JS",
  },
  {
    id: "tx_02",
    type: "withdrawal",
    amount: 50.00,
    timestamp: "2 hours ago",
    status: "success",
    address: "GAPR...88WW",
  },
  {
    id: "tx_03",
    type: "deposit",
    amount: 500.00,
    timestamp: "1 day ago",
    status: "success",
    address: "GBSC...OOUQ",
  },
  {
    id: "tx_04",
    type: "withdrawal",
    amount: 250.00,
    timestamp: "3 days ago",
    status: "success",
    address: "GBND...XNVA",
  }
]

export default function WalletView() {
  const { wallet, isLoading, error, mutate } = useWallet()
  const [isFundOpen, setIsFundOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)

  const balance = wallet?.balance ?? 0
  const address = wallet?.address ?? ""

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Embedded Wallet</h1>
            <p className="text-sm text-foreground/70">
              Manage your Stellar identity and liquidity intents
            </p>
          </div>
        </div>

        {/* Public stellar badge */}
        {!isLoading && address && (
          <div className="flex items-center gap-2 self-start rounded-2xl bg-surface-container-low px-4 py-2 border border-outline-variant/30">
            <span className="text-xs font-semibold text-foreground/50 uppercase tracking-widest">
              Stellar Address:
            </span>
            <WalletBadge address={address} />
          </div>
        )}
      </div>

      {/* Grid Layout: Snapshot & Controls */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Balance Snapshot Card */}
        <div className="md:col-span-2">
          <BalanceCard 
            balance={balance} 
            isLoading={isLoading} 
            onRefresh={mutate} 
          />
        </div>

        {/* Operations / Actions */}
        <div className="flex flex-col justify-between rounded-[1.75rem] border border-outline-variant/60 bg-white/95 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
          <div>
            <h2 className="text-md font-semibold text-foreground flex items-center gap-2 mb-2">
              <ArrowRightLeft className="h-4 w-4 text-primary" />
              Quick Actions
            </h2>
            <p className="text-xs text-foreground/60 leading-relaxed">
              Top up your test balance or move funds out of the PadiPay ecosystem instantly.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setIsFundOpen(true)}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary hover:bg-primary-hover shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              Fund Wallet
            </button>

            <button
              type="button"
              onClick={() => setIsWithdrawOpen(true)}
              disabled={isLoading || balance <= 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-outline px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title={balance <= 0 ? "Deposit funds to activate withdrawal" : "Withdraw funds"}
            >
              <ArrowUpRight className="h-4 w-4" />
              Withdraw Funds
            </button>
          </div>
        </div>
      </div>

      {/* API Error Box */}
      {error && !isLoading && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
          <span>Failed to sync with Stellar node. Some real-time balances might be outdated.</span>
        </div>
      )}

      {/* Transaction History Section */}
      <div className="rounded-[1.75rem] border border-outline-variant/60 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,28,45,0.07)] sm:p-8">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-6">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-foreground/60" />
            Transaction History
          </h2>
          <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-semibold text-on-surface">
            Stellar USDC
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-xs font-semibold uppercase tracking-wider text-foreground/45">
                <th className="pb-3 pl-2">Transaction ID</th>
                <th className="pb-3 text-center">Type</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-center">Destination/Source</th>
                <th className="pb-3 text-center">Date</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-sm">
              {MOCK_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-container-low/20 transition-colors">
                  <td className="py-4 pl-2 font-mono text-xs text-foreground/70">{tx.id}</td>
                  <td className="py-4 text-center">
                    <span 
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === "deposit" 
                          ? "bg-emerald-500/10 text-emerald-600" 
                          : "bg-orange-500/10 text-orange-600"
                      }`}
                    >
                      {tx.type === "deposit" ? (
                        <ArrowDownLeft className="h-3 w-3" />
                      ) : (
                        <ArrowUpRight className="h-3 w-3" />
                      )}
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-4 text-right font-semibold text-foreground">
                    {tx.type === "deposit" ? "+" : "-"}${tx.amount.toFixed(2)}
                  </td>
                  <td className="py-4 text-center font-mono text-xs text-on-surface-variant">
                    {tx.address}
                  </td>
                  <td className="py-4 text-center text-on-surface-variant text-xs">{tx.timestamp}</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals wiring */}
      <FundModal 
        isOpen={isFundOpen} 
        onClose={() => setIsFundOpen(false)} 
        mutateBalance={mutate} 
      />

      <WithdrawModal 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        availableBalance={balance} 
        mutateBalance={mutate} 
      />
    </div>
  )
}
