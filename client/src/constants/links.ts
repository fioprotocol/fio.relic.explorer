interface FooterLink {
  to?: string;
  href?: string;
  label: string;
  icon?: string;
}

export const FIO_DAPP_LINK = 'https://app.fio.net';

export const SOCIAL_LINKS: FooterLink[] = [
  { href: 'https://discord.gg/fio', icon: 'discord', label: 'Discord' },
  { href: '/', icon: 'hive', label: 'Hive' },
  { href: 'https://x.com/fioprotocol', icon: 'x', label: 'X (Twitter)' },
  { href: 'https://facebook.com/fioprotocol', icon: 'facebook', label: 'Facebook' },
  { href: 'https://github.com/fioprotocol', icon: 'github', label: 'GitHub' },
  { href: 'https://instagram.com/fioprotocol', icon: 'instagram', label: 'Instagram' },
  { href: 'https://linkedin.com/company/fioprotocol', icon: 'linkedin', label: 'LinkedIn' },
  { href: 'https://medium.com/fioprotocol', icon: 'medium', label: 'Medium' },
  { href: 'https://mastodon.social/@fioprotocol', icon: 'mastodon', label: 'Mastodon' },
  { href: 'https://binance.com', icon: 'binance', label: 'Binance' },
  { href: 'https://nostr.com', icon: 'nostr', label: 'Nostr' },
  { href: 'https://reddit.com/r/fioprotocol', icon: 'reddit', label: 'Reddit' },
  { href: 'https://t.me/fioprotocol', icon: 'telegram', label: 'Telegram' },
  { href: 'https://twitter.com/fioprotocol', icon: 'twitter', label: 'Twitter' },
  { href: 'https://tiktok.com/@fioprotocol', icon: 'tt', label: 'TikTok' },
  { href: 'https://whatsapp.com/fioprotocol', icon: 'whatsapp', label: 'WhatsApp' },
  { href: 'https://youtube.com/fioprotocol', icon: 'youtube', label: 'YouTube' },
  { href: 'https://farcaster.xyz/fioprotocol', icon: 'farcaster', label: 'Farcaster' },
];

export const EXPLORER_LINKS: FooterLink[] = [
  { to: '/transactions', label: 'Transactions' },
  { to: '/blocks', label: 'Blocks' },
  { to: '/handles', label: 'FIO Handles' },
  { to: '/domains', label: 'FIO Domains' },
  { to: '/accounts', label: 'Accounts' },
];

export const RESOURCE_LINKS: FooterLink[] = [
  { to: '/block-producers', label: 'Block Producers' },
  { to: '/proxies', label: 'Proxies' },
  { to: '/multisigs', label: 'Multisigs' },
  { to: '/contracts', label: 'Contracts' },
];

export const EXTERNAL_LINKS: FooterLink[] = [
  { href: 'https://dev.fio.net/', label: 'Developer Portal' },
  { href: 'https://fio.net', label: 'FIO Website' },
  { href: FIO_DAPP_LINK, label: 'FIO dApp' },
];

export const LEGAL_LINKS: FooterLink[] = [
  { to: '/support', label: 'Support' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-of-service', label: 'Terms of Service' },
];
