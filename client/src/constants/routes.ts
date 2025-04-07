interface Route {
  path: string;
  label: string;
}

export const ROUTES: Record<string, Route> = {
  home: { path: '/', label: 'Home' },
  search: { path: '/search', label: 'Search' },
  searchNotFound: { path: '/search/not-found', label: 'Search Not Found' },
  transactions: { path: '/transactions', label: 'Transactions' },
  transaction: { path: '/transactions/:id', label: 'Transaction' },
  handle: { path: '/handles/:id', label: 'FIO Handle' },
  domain: { path: '/domains/:id', label: 'FIO Domain' },
  account: { path: '/accounts/:id', label: 'Account' },
};
