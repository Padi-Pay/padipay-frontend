export interface Transaction {
  id: string;
  hash: string;
  ledger: number;
  created_at: string;
  source_account: string;
  destination_account: string;
  type: string;
  status: string;
  amount: number;
  fee: number;
  memo_type: string;
  memo: string;
  token_symbol: string;
  envelope_xdr: string;
  result_xdr: string;
  operation_count: number;
  protocol_version: number;
  signatures: string[];
}

export interface TransactionSummaryStats {
  totalDeposited: number;
  totalWithdrawn: number;
  netFlow: number;
  totalFees: number;
  successRate: number;
  transactionCount: number;
}

/**
 * Filter transactions by matching public key.
 */
export function filterTransactionsByAddress(txs: Transaction[], address: string): Transaction[] {
  if (!address) return txs;
  const normalized = address.toLowerCase().trim();
  return txs.filter(
    (tx) =>
      tx.source_account.toLowerCase().includes(normalized) ||
      tx.destination_account.toLowerCase().includes(normalized)
  );
}

/**
 * Filter transactions by operation type.
 */
export function filterTransactionsByType(txs: Transaction[], type: string): Transaction[] {
  if (!type || type === "all") return txs;
  return txs.filter((tx) => tx.type.toLowerCase() === type.toLowerCase());
}

/**
 * Filter transactions by execution status.
 */
export function filterTransactionsByStatus(txs: Transaction[], status: string): Transaction[] {
  if (!status || status === "all") return txs;
  return txs.filter((tx) => tx.status.toLowerCase() === status.toLowerCase());
}

/**
 * Sort transactions by chronological order.
 */
export function sortTransactions(
  txs: Transaction[],
  direction: "asc" | "desc" = "desc"
): Transaction[] {
  return [...txs].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return direction === "asc" ? timeA - timeB : timeB - timeA;
  });
}

/**
 * Paginate transaction results.
 */
export function paginateTransactions(
  txs: Transaction[],
  page: number,
  pageSize: number
): {
  data: Transaction[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
} {
  const totalItems = txs.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = txs.slice(startIndex, endIndex);

  return {
    data,
    totalPages,
    currentPage,
    totalItems,
  };
}

/**
 * Compute transaction ledger aggregate stats.
 */
export function calculateStellarAggregates(txs: Transaction[]): TransactionSummaryStats {
  const transactionCount = txs.length;
  if (transactionCount === 0) {
    return {
      totalDeposited: 0,
      totalWithdrawn: 0,
      netFlow: 0,
      totalFees: 0,
      successRate: 100,
      transactionCount: 0,
    };
  }

  let totalDeposited = 0;
  let totalWithdrawn = 0;
  let totalFees = 0;
  let successCount = 0;

  txs.forEach((tx) => {
    totalFees += tx.fee;
    
    if (tx.status.toLowerCase() === "success") {
      successCount++;
      if (tx.type === "deposit" || tx.type === "escrow_released") {
        totalDeposited += tx.amount;
      } else if (tx.type === "withdrawal" || tx.type === "escrow_created") {
        totalWithdrawn += tx.amount;
      }
    }
  });

  const netFlow = totalDeposited - totalWithdrawn;
  const successRate = Math.round((successCount / transactionCount) * 100);

  return {
    totalDeposited: roundSum(totalDeposited),
    totalWithdrawn: roundSum(totalWithdrawn),
    netFlow: roundSum(netFlow),
    totalFees: roundSum(totalFees, 5),
    successRate,
    transactionCount,
  };
}

function roundSum(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
