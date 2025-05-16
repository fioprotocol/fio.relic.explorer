import { SOCIAL_MEDIA_IDS, SOCIAL_MEDIA_URLS } from '@shared/constants/social-media-links';
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
    href: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.DISCORDSER]}pHBmJCc`,
    icon: 'discord',
    label: 'Discord',
  },
  {
    href: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.TWITTER]}joinFIO`,
    icon: 'x',
    label: 'X (Twitter)',
  },
  {
    href: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.FACEBOOK]}officialFIO`,
    icon: 'facebook',
    label: 'Facebook',
  },
  {
    href: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.GITHUB]}fioprotocol`,
    icon: 'github',
    label: 'GitHub',
  },
  {
    href: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.INSTAGRAM]}join.fio/`,
    icon: 'instagram',
    label: 'Instagram',
  },
  {
    href: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.LINKEDINCO]}fioprotocol/`,
    icon: 'linkedin',
    label: 'LinkedIn',
  },
  {
    href: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.MEDIUM]}fio-blog`,
    icon: 'medium',
    label: 'Medium',
  },
  {
    href: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.BINANCE]}fioprotocol`,
    icon: 'binance',
    label: 'Binance',
  },
  {
    href: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.REDDITCOMPANY]}officialFIO`,
    icon: 'reddit',
    label: 'Reddit',
  },
  {
    href: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.TELEGRAM]}joinFIO`,
    icon: 'telegram',
    label: 'Telegram',
  },
  {
    href: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.TIKTOK]}join_fio`,
    icon: 'tt',
    label: 'TikTok',
  },
  {
    href: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.YOUTUBE]}FIOprotocol`,
    icon: 'youtube',
    label: 'YouTube',
  },
  {
    href: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.WARPCAST]}joinfio`,
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
