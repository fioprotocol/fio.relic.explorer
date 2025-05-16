import { SOCIAL_MEDIA_URLS } from '@shared/constants/social-media-links';
import { SOCIAL_MEDIA_IDS } from '@shared/constants/social-media-links';
import { BlockProducer } from '@shared/types/fio-api-server';

import { Producer } from 'src/services/bpmonitor';

import websiteLogo from 'src/assets/icons/social-network-governance/website.svg';
import xLogo from 'src/assets/icons/social-network-governance/x.svg';
import telegramLogo from 'src/assets/icons/social-network-governance/telegram.svg';
import defaultLogo from 'src/assets/no-bp-icon.svg';

import { BlockProducerProps } from 'src/pages/BlockProducersPage/types';

export const transformBlockProducer = ({
  producer,
  bpMonitorProducers,
}: {
  producer: BlockProducer | Producer;
  bpMonitorProducers: Map<string, Producer>;
}): BlockProducerProps => {
  const bpMonitorProducer = bpMonitorProducers.get(producer?.owner);

  const { branding, candidate_name, flagIconUrl, score, socials, url } = bpMonitorProducer || {};

  const links = [];

  if (socials?.telegram) {
    links.push({
      name: 'telegram',
      url: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.TELEGRAM]}${socials?.telegram}`,
      logo: telegramLogo,
    });
  }

  if (socials?.twitter) {
    links.push({
      name: 'x',
      url: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.TWITTER]}${socials?.twitter}`,
      logo: xLogo,
    });
  }

  if (url) {
    links.push({
      name: 'Website',
      url,
      logo: websiteLogo,
    });
  }

  return {
    account: producer?.owner,
    fioHandle: producer?.fio_address,
    votes: producer?.total_votes,
    links,
    flagIconUrl: flagIconUrl || '',
    grade: score?.grade || '',
    name: candidate_name || 'N/A',
    logo: branding?.logo_svg || branding?.logo_256 || defaultLogo,
    ranks: score?.score || 0,
    index: bpMonitorProducer?.index || 0,
  };
};
