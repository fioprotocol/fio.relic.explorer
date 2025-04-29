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
  blocks: { path: '/blocks', label: 'Blocks' },
  block: { path: '/blocks/:id', label: 'Block' },
  handles: { path: '/handles', label: 'FIO Handles' },
  handle: { path: '/handles/:id', label: 'FIO Handle' },
  domains: { path: '/domains', label: 'FIO Domains' },
  domain: { path: '/domains/:id', label: 'FIO Domain' },
  accounts: { path: '/accounts', label: 'Accounts' },
  account: { path: '/accounts/:id', label: 'Account' },
  governance: { path: '/governance', label: 'Governance' },
  producers: { path: '/governance/producers', label: 'Producers' },
  proxies: { path: '/governance/proxies', label: 'Proxies' },
  advanced: { path: '/advanced', label: 'Advanced' },
  contracts: { path: '/state_data', label: 'Contracts' },
  multisigs: { path: '/multi-sigs', label: 'Multisigs' },

  healthCheck: { path: '/health-check', label: 'Health Check' },
  about: { path: '/about', label: 'About' },

  support: { path: '/support', label: 'Support' },
  privacyPolicy: { path: '/privacy-policy', label: 'Privacy Policy' },
  termsOfService: { path: '/terms-of-service', label: 'Terms of Service' },
};
