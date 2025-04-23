import BigNumber from 'big.js';

import { BlockProducer, BlockProducerResponse } from '@shared/types/fio-api-server';
import { useGetData } from 'src/hooks/useGetData';
import { getBlockProducers } from 'src/services/fio';
import useProducers from 'src/hooks/useProducers';
import { SOCIAL_MEDIA_IDS, SOCIAL_MEDIA_URLS } from '@shared/constants/social-media-links';

import websiteLogo from 'src/assets/icons/social-network-governance/website.svg';
import twitterLogo from 'src/assets/icons/social-network-governance/twitter.svg';
import telegramLogo from 'src/assets/icons/social-network-governance/telegram.svg';
import defaultLogo from 'src/assets/no-bp-icon.svg';

import { BlockProducerProps } from './types';

type UseBlockProducersPageContextType = {
  columns: { key: string; title: string }[];
  loading: boolean;
  producers: BlockProducerProps[];
};

export const useBlockProducersPageContext = (): UseBlockProducersPageContextType => {
  const { response: fioChainblockProducers, loading } = useGetData<BlockProducerResponse>({
    action: getBlockProducers,
  });

  const { producers: bpMonitorProducers, loading: bpMonitorLoading } = useProducers({
    refresh: true,
  });

  const activeFioChainProducers =
    fioChainblockProducers?.producers?.length && bpMonitorProducers?.size > 0
      ? fioChainblockProducers?.producers?.filter(
        (blockProducer: BlockProducer) =>
          blockProducer?.is_active === 1 && new BigNumber(blockProducer?.total_votes).gt(0)
      )
      : [];

  const producers: BlockProducerProps[] = activeFioChainProducers
    ?.map(blockProducer => {
      const bpMonitorProducer = bpMonitorProducers.get(blockProducer?.owner);

      const { branding, candidate_name, flagIconUrl, score, socials, url } =
        bpMonitorProducer || {};

      const links = [];

      if (socials?.twitter) {
        links.push({
          name: 'twitter',
          url: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.TWITTER]}${socials?.twitter}`,
          logo: twitterLogo,
        });
      }

      if (socials?.telegram) {
        links.push({
          name: 'telegram',
          url: `${SOCIAL_MEDIA_URLS[SOCIAL_MEDIA_IDS.TELEGRAM]}${socials?.telegram}`,
          logo: telegramLogo,
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
        account: blockProducer?.owner,
        fioHandle: blockProducer?.fio_address,
        votes: blockProducer?.total_votes,
        links,
        flagIconUrl: flagIconUrl || '',
        grade: score?.grade || '',
        name: candidate_name || 'N/A',
        logo: branding?.logo_svg || branding?.logo_256 || defaultLogo,
        ranks: score?.score || 0,
      };
    })
    .sort((a, b) => b.ranks - a.ranks);

  const columns = [
    { key: 'name', title: 'Block Producer' },
    { key: 'account', title: 'Account' },
    { key: 'fioHandle', title: 'FIO Handle' },
    { key: 'votes', title: 'Votes' },
    { key: 'links', title: 'Social' },
    { key: 'location', title: 'Location' },
    { key: 'grade', title: 'Grade' },
    { key: 'ranks', title: 'Ranks' },
  ];

  return { columns, loading: loading || bpMonitorLoading, producers };
};
