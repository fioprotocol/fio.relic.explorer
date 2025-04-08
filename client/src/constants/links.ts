import { ROUTES } from './routes';

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
