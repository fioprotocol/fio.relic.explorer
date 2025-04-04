export interface TransactionsByDate {
  date: string;
  transactions: number;
}

export interface StatsResponse {
  data: {
    fioHandlesRegistered: number;
    fioHandlesActive: number;
    fioDomainsRegistered: number;
    fioDomainsActive: number;
    latestBlock: number;
    latestIrreversibleBlock: number;
    transactions: TransactionsByDate[];
  };
}
