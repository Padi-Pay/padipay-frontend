import { describe, it, expect } from "vitest"
import {
  Transaction,
  filterTransactionsByAddress,
  filterTransactionsByType,
  filterTransactionsByStatus,
  sortTransactions,
  paginateTransactions,
  calculateStellarAggregates,
} from "../lib/utils/transactionParser"

const MOCK_DATA: Transaction[] = [
  {
    id: "tx_01",
    hash: "HASH_A",
    ledger: 100,
    created_at: "2026-07-28T12:00:00Z",
    source_account: "GD1111",
    destination_account: "GB2222",
    type: "deposit",
    status: "success",
    amount: 1500.5,
    fee: 0.0001,
    memo_type: "text",
    memo: "payment",
    token_symbol: "USDC",
    envelope_xdr: "XDR_ENV",
    result_xdr: "XDR_RES",
    operation_count: 1,
    protocol_version: 20,
    signatures: ["SIG_A"],
  },
  {
    id: "tx_02",
    hash: "HASH_B",
    ledger: 101,
    created_at: "2026-07-29T10:00:00Z",
    source_account: "GB2222",
    destination_account: "GC3333",
    type: "withdrawal",
    status: "success",
    amount: 500,
    fee: 0.0002,
    memo_type: "text",
    memo: "payout",
    token_symbol: "USDC",
    envelope_xdr: "XDR_ENV",
    result_xdr: "XDR_RES",
    operation_count: 1,
    protocol_version: 20,
    signatures: ["SIG_B"],
  },
  {
    id: "tx_03",
    hash: "HASH_C",
    ledger: 102,
    created_at: "2026-07-27T08:00:00Z",
    source_account: "GD1111",
    destination_account: "GC3333",
    type: "escrow_created",
    status: "failed",
    amount: 1000,
    fee: 0.00015,
    memo_type: "none",
    memo: "",
    token_symbol: "USDC",
    envelope_xdr: "XDR_ENV",
    result_xdr: "XDR_RES",
    operation_count: 1,
    protocol_version: 20,
    signatures: ["SIG_C"],
  },
]

describe("Transaction Parser Utilities", () => {
  it("filters transactions by address", () => {
    const results = filterTransactionsByAddress(MOCK_DATA, "GD1111")
    expect(results).toHaveLength(2)
    // Matches tx_01 (source) and tx_03 (source)
    expect(results.map((r) => r.id)).toContain("tx_01")
    expect(results.map((r) => r.id)).toContain("tx_03")

    const noMatches = filterTransactionsByAddress(MOCK_DATA, "GEMPTY")
    expect(noMatches).toHaveLength(0)
  })

  it("filters transactions by type", () => {
    const deposits = filterTransactionsByType(MOCK_DATA, "deposit")
    expect(deposits).toHaveLength(1)
    expect(deposits[0].id).toBe("tx_01")

    const all = filterTransactionsByType(MOCK_DATA, "all")
    expect(all).toHaveLength(3)
  })

  it("filters transactions by status", () => {
    const successLogs = filterTransactionsByStatus(MOCK_DATA, "success")
    expect(successLogs).toHaveLength(2)

    const failedLogs = filterTransactionsByStatus(MOCK_DATA, "failed")
    expect(failedLogs).toHaveLength(1)
    expect(failedLogs[0].id).toBe("tx_03")
  })

  it("sorts transactions by date", () => {
    const sortedDesc = sortTransactions(MOCK_DATA, "desc")
    expect(sortedDesc[0].id).toBe("tx_02") // 29th
    expect(sortedDesc[1].id).toBe("tx_01") // 28th
    expect(sortedDesc[2].id).toBe("tx_03") // 27th

    const sortedAsc = sortTransactions(MOCK_DATA, "asc")
    expect(sortedAsc[0].id).toBe("tx_03") // 27th
    expect(sortedAsc[2].id).toBe("tx_02") // 29th
  })

  it("paginates transaction arrays correctly", () => {
    const page1 = paginateTransactions(MOCK_DATA, 1, 2)
    expect(page1.data).toHaveLength(2)
    expect(page1.totalPages).toBe(2)
    expect(page1.totalItems).toBe(3)
    expect(page1.currentPage).toBe(1)

    const page2 = paginateTransactions(MOCK_DATA, 2, 2)
    expect(page2.data).toHaveLength(1)
    expect(page2.currentPage).toBe(2)
  })

  it("computes aggregates correctly, ignoring failed transactions", () => {
    const stats = calculateStellarAggregates(MOCK_DATA)
    // tx_01 (deposit, success, 1500.5) -> totalDeposited = 1500.5
    // tx_02 (withdrawal, success, 500) -> totalWithdrawn = 500
    // tx_03 (failed, ignored in payouts/deposits) -> totalDeposited/Withdrawn should not count it
    // fees: 0.0001 + 0.0002 + 0.00015 = 0.00045
    // successRate: 2 / 3 = 67%
    
    expect(stats.totalDeposited).toBe(1500.5)
    expect(stats.totalWithdrawn).toBe(500)
    expect(stats.netFlow).toBe(1000.5)
    expect(stats.totalFees).toBe(0.00045)
    expect(stats.successRate).toBe(67)
    expect(stats.transactionCount).toBe(3)
  })

  it("returns default values on empty dataset", () => {
    const stats = calculateStellarAggregates([])
    expect(stats.totalDeposited).toBe(0)
    expect(stats.totalWithdrawn).toBe(0)
    expect(stats.netFlow).toBe(0)
    expect(stats.totalFees).toBe(0)
    expect(stats.successRate).toBe(100)
    expect(stats.transactionCount).toBe(0)
  })
})
