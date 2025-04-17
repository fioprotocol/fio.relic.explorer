import { FC } from 'react';

import { ReactComponent as DISCORD } from 'src/assets/icons/social-network-icons-rounded/discord.svg';
import { ReactComponent as FACEBOOK } from 'src/assets/icons/social-network-icons-rounded/facebook.svg';
import { ReactComponent as FARCASTER } from 'src/assets/icons/social-network-icons-rounded/farcaster.svg';
import { ReactComponent as HIVE } from 'src/assets/icons/social-network-icons-rounded/hive.svg';
import { ReactComponent as INSTAGRAM } from 'src/assets/icons/social-network-icons-rounded/instagram.svg';
import { ReactComponent as LINKEDIN } from 'src/assets/icons/social-network-icons-rounded/linkedin.svg';
import { ReactComponent as MASTODON } from 'src/assets/icons/social-network-icons-rounded/mastodon.svg';
import { ReactComponent as NOSTR } from 'src/assets/icons/social-network-icons-rounded/nostr.svg';
import { ReactComponent as REDDIT } from 'src/assets/icons/social-network-icons-rounded/reddit.svg';
import { ReactComponent as TELEGRAM } from 'src/assets/icons/social-network-icons-rounded/telegram.svg';
import { ReactComponent as TWITTER } from 'src/assets/icons/social-network-icons-rounded/twitter.svg';
import { ReactComponent as WHATSAPP } from 'src/assets/icons/social-network-icons-rounded/whatsapp.svg';
import { ReactComponent as YOUTUBE } from 'src/assets/icons/social-network-icons-rounded/youtube.svg';

import { ReactComponent as DISCORD_DL } from 'src/assets/icons/social-network-icons-rounded-dark-light/discord.svg';
import { ReactComponent as FACEBOOK_DL } from 'src/assets/icons/social-network-icons-rounded-dark-light/facebook.svg';
import { ReactComponent as FARCASTER_DL } from 'src/assets/icons/social-network-icons-rounded-dark-light/farcaster.svg';
import { ReactComponent as HIVE_DL } from 'src/assets/icons/social-network-icons-rounded-dark-light/hive.svg';
import { ReactComponent as INSTAGRAM_DL } from 'src/assets/icons/social-network-icons-rounded-dark-light/instagram.svg';
import { ReactComponent as LINKEDIN_DL } from 'src/assets/icons/social-network-icons-rounded-dark-light/linkedin.svg';
import { ReactComponent as MASTODON_DL } from 'src/assets/icons/social-network-icons-rounded-dark-light/mastodon.svg';
import { ReactComponent as NOSTR_DL } from 'src/assets/icons/social-network-icons-rounded-dark-light/nostr.svg';
import { ReactComponent as REDDIT_DL } from 'src/assets/icons/social-network-icons-rounded-dark-light/reddit.svg';
import { ReactComponent as TELEGRAM_DL } from 'src/assets/icons/social-network-icons-rounded-dark-light/telegram.svg';
import { ReactComponent as TWITTER_DL } from 'src/assets/icons/social-network-icons-rounded-dark-light/twitter.svg';
import { ReactComponent as WHATSAPP_DL } from 'src/assets/icons/social-network-icons-rounded-dark-light/whatsapp.svg';
import { ReactComponent as YOUTUBE_DL } from 'src/assets/icons/social-network-icons-rounded-dark-light/youtube.svg';

import { SOCIAL_MEDIA_IDS } from '@shared/constants/social-media-links';

const SOCIAL_LOGO_MAP = {
  [SOCIAL_MEDIA_IDS.DISCORD]: { light: DISCORD, dark: DISCORD_DL },
  [SOCIAL_MEDIA_IDS.DISCORDSER]: { light: DISCORD, dark: DISCORD_DL },
  [SOCIAL_MEDIA_IDS.FACEBOOK]: { light: FACEBOOK, dark: FACEBOOK_DL },
  [SOCIAL_MEDIA_IDS.FARCASTER]: { light: FARCASTER, dark: FARCASTER_DL },
  [SOCIAL_MEDIA_IDS.HIVE]: { light: HIVE, dark: HIVE_DL },
  [SOCIAL_MEDIA_IDS.INSTAGRAM]: { light: INSTAGRAM, dark: INSTAGRAM_DL },
  [SOCIAL_MEDIA_IDS.LINKEDIN]: { light: LINKEDIN, dark: LINKEDIN_DL },
  [SOCIAL_MEDIA_IDS.LINKEDINCO]: { light: LINKEDIN, dark: LINKEDIN_DL },
  [SOCIAL_MEDIA_IDS.MASTODON]: { light: MASTODON, dark: MASTODON_DL },
  [SOCIAL_MEDIA_IDS.NOSTR]: { light: NOSTR, dark: NOSTR_DL },
  [SOCIAL_MEDIA_IDS.REDDIT]: { light: REDDIT, dark: REDDIT_DL },
  [SOCIAL_MEDIA_IDS.TELEGRAM]: { light: TELEGRAM, dark: TELEGRAM_DL },
  [SOCIAL_MEDIA_IDS.TWITTER]: { light: TWITTER, dark: TWITTER_DL },
  [SOCIAL_MEDIA_IDS.WHATSAPP]: { light: WHATSAPP, dark: WHATSAPP_DL },
  [SOCIAL_MEDIA_IDS.YOUTUBE]: { light: YOUTUBE, dark: YOUTUBE_DL },
};

export const SocialMediaLogo: FC<{
  socialMediaId: keyof typeof SOCIAL_LOGO_MAP;
  variant?: 'light' | 'dark';
}> = ({ socialMediaId, variant = 'light' }) => {
  const Logo = SOCIAL_LOGO_MAP[socialMediaId]?.[variant];

  if (!Logo) {
    return null;
  }

  return <Logo />;
};
