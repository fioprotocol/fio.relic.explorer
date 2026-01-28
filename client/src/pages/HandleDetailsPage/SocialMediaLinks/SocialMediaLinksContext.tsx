import { PubAddress } from '@shared/types/pub-address';

import { SOCIALS_CHAIN_CODE } from '@shared/constants/pub-address';
import { SOCIAL_MEDIA_MAP } from '@shared/constants/social-media-links';

type UseSocialMediaLinksContext = {
  links: { id: keyof typeof SOCIAL_MEDIA_MAP; url: string; title: string }[];
};

export const useSocialMediaLinksContext = ({
  mappedPubAddresses,
}: {
  mappedPubAddresses: PubAddress[];
}): UseSocialMediaLinksContext => {
  return {
    links: mappedPubAddresses
      .filter((address) => address.chain_code === SOCIALS_CHAIN_CODE)
      .map((address) => {
        const socialMediaId = address.token_code.toUpperCase() as keyof typeof SOCIAL_MEDIA_MAP;

        if (!SOCIAL_MEDIA_MAP[socialMediaId]) {
          return {
            id: socialMediaId,
            url: address.public_address,
            title: address.token_code,
          };
        }

        return {
          id: socialMediaId,
          url: `${SOCIAL_MEDIA_MAP[socialMediaId].link}${address.public_address}`,
          title: SOCIAL_MEDIA_MAP[socialMediaId].name,
        };
      })
      .filter(Boolean),
  };
};
