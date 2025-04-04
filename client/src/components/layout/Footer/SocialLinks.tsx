import React from 'react';
import { Col, Row } from 'react-bootstrap';

import ScrollToTop from 'src/components/common/ScrollToTop/ScrollToTop';

import { ReactComponent as DiscordIcon } from '../../../assets/icons/discord.svg';
import { ReactComponent as FacebookIcon } from '../../../assets/icons/facebook.svg';
import { ReactComponent as GithubIcon } from '../../../assets/icons/github.svg';
import { ReactComponent as InstagramIcon } from '../../../assets/icons/instagram.svg';
import { ReactComponent as LinkedinIcon } from '../../../assets/icons/linkedin.svg';
import { ReactComponent as MediumIcon } from '../../../assets/icons/medium.svg';
import { ReactComponent as MastodonIcon } from '../../../assets/icons/mastedon.svg';
import { ReactComponent as HiveIcon } from '../../../assets/icons/hive.svg';
import { ReactComponent as XIcon } from '../../../assets/icons/x.svg';
import { ReactComponent as BinanceIcon } from '../../../assets/icons/binance.svg';
import { ReactComponent as NostrIcon } from '../../../assets/icons/nostr.svg';
import { ReactComponent as RedditIcon } from '../../../assets/icons/reddit.svg';
import { ReactComponent as TelegramIcon } from '../../../assets/icons/telegram.svg';
import { ReactComponent as TwitterIcon } from '../../../assets/icons/twitter.svg';
import { ReactComponent as TtIcon } from '../../../assets/icons/tt.svg';
import { ReactComponent as WhatsappIcon } from '../../../assets/icons/whatsapp.svg';
import { ReactComponent as YoutubeIcon } from '../../../assets/icons/youtube.svg';
import { ReactComponent as FarcasterIcon } from '../../../assets/icons/farcaster.svg';

import { SOCIAL_LINKS } from '../../../constants/links';

import styles from './Footer.module.scss';

interface SocialLinksProps {
  className?: string;
}

const iconMap: { [key: string]: React.ComponentType } = {
  discord: DiscordIcon,
  facebook: FacebookIcon,
  github: GithubIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  medium: MediumIcon,
  mastodon: MastodonIcon,
  hive: HiveIcon,
  x: XIcon,
  binance: BinanceIcon,
  nostr: NostrIcon,
  reddit: RedditIcon,
  telegram: TelegramIcon,
  twitter: TwitterIcon,
  tt: TtIcon,
  whatsapp: WhatsappIcon,
  youtube: YoutubeIcon,
  farcaster: FarcasterIcon,
};

const SocialLinks: React.FC<SocialLinksProps> = ({ className = '' }) => {
  const renderLink = (item: { href?: string; label: string; icon?: string }): React.ReactNode => {
    const IconComponent = item.icon ? iconMap[item.icon] : null;

    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="d-flex align-items-center justify-content-center"
      >
        {IconComponent ? <IconComponent aria-label={item.label} /> : item.label}
      </a>
    );
  };

  return (
    <Row className="mb-4">
      <Col xs={12}>
        <Row className="mb-4">
          <Col xs={9} md={5}>
            <div className={`d-flex gap-2 gap-lg-1 justify-content-start flex-wrap ${className}`}>
              {SOCIAL_LINKS.map((item, index) => (
                <div key={index} className={styles.socialIcon}>
                  {renderLink(item)}
                </div>
              ))}
            </div>
          </Col>
          <Col xs={3} md={7}>
            <div className="d-flex justify-content-end">
              <ScrollToTop />
            </div>
          </Col>
        </Row>
        <div className="border-bottom border-secondary" />
      </Col>
    </Row>
  );
};

export default SocialLinks;
