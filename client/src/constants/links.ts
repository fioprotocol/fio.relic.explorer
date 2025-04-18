import { ROUTES } from './routes';

interface FooterLink {
  to?: string;
  href?: string;
  label: string;
  icon?: string;
}

export const FIO_DAPP_LINK = 'https://app.fio.net';

export const SOCIAL_LINKS: FooterLink[] = [
  {
    href: 'https://discord.gg/pHBmJCc',
    icon: 'discord',
    label: 'Discord',
  },
  {
    href: 'https://twitter.com/joinFIO',
    icon: 'x',
    label: 'X (Twitter)',
  },
  {
    href: 'https://www.facebook.com/officialFIO',
    icon: 'facebook',
    label: 'Facebook',
  },
  {
    href: 'https://github.com/fioprotocol',
    icon: 'github',
    label: 'GitHub',
  },
  {
    href: 'https://www.instagram.com/join.fio/',
    icon: 'instagram',
    label: 'Instagram',
  },
  {
    href: 'https://www.linkedin.com/company/fioprotocol/',
    icon: 'linkedin',
    label: 'LinkedIn',
  },
  {
    href: 'https://medium.com/fio-blog',
    icon: 'medium',
    label: 'Medium',
  },
  {
    href: 'https://www.binance.com/en/square/profile/fioprotocol',
    icon: 'binance',
    label: 'Binance',
  },
  {
    href: 'https://www.reddit.com/r/officialFIO',
    icon: 'reddit',
    label: 'Reddit',
  },
  {
    href: 'https://t.me/joinFIO',
    icon: 'telegram',
    label: 'Telegram',
  },
  {
    href: 'https://www.tiktok.com/@join_fio',
    icon: 'tt',
    label: 'TikTok',
  },
  {
    href: 'https://www.youtube.com/@FIOprotocol',
    icon: 'youtube',
    label: 'YouTube',
  },
  {
    href: 'https://warpcast.com/joinfio',
    icon: 'farcaster',
    label: 'Farcaster',
  },
  // Add when needed
  // { href: 'https://mastodon.social/@fioprotocol', icon: 'mastodon', label: 'Mastodon' },
  // { href: 'https://nostr.com', icon: 'nostr', label: 'Nostr' },
  // { href: 'https://whatsapp.com/fioprotocol', icon: 'whatsapp', label: 'WhatsApp' },
  // { href: '/', icon: 'hive', label: 'Hive' },
];

export const EXPLORER_LINKS: FooterLink[] = [
  { to: ROUTES.transactions.path, label: ROUTES.transactions.label },
  { to: ROUTES.blocks.path, label: ROUTES.blocks.label },
  { to: ROUTES.handles.path, label: ROUTES.handles.label },
  { to: ROUTES.domains.path, label: ROUTES.domains.label },
  { to: ROUTES.accounts.path, label: ROUTES.accounts.label },
];

export const RESOURCE_LINKS: FooterLink[] = [
  { to: ROUTES.producers.path, label: ROUTES.producers.label },
  { to: ROUTES.proxies.path, label: ROUTES.proxies.label },
  { to: ROUTES.multisigs.path, label: ROUTES.multisigs.label },
  { to: ROUTES.contracts.path, label: ROUTES.contracts.label },
];

export const EXTERNAL_LINKS: FooterLink[] = [
  { href: 'https://dev.fio.net/', label: 'Developer Portal' },
  { href: 'https://fio.net', label: 'FIO Website' },
  { href: FIO_DAPP_LINK, label: 'FIO dApp' },
];

export const LEGAL_LINKS: FooterLink[] = [
  { to: ROUTES.support.path, label: ROUTES.support.label },
  { to: ROUTES.privacyPolicy.path, label: ROUTES.privacyPolicy.label },
  { to: ROUTES.termsOfService.path, label: ROUTES.termsOfService.label },
];
