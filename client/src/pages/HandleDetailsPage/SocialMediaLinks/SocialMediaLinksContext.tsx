import { PubAddress } from '@shared/types/pub-address';

import { SOCIALS_CHAIN_CODE } from '@shared/constants/pub-address';

type UseSocialMediaLinksContext = {
  links: { url: string; title: string }[];
};

export const useSocialMediaLinksContext = ({
  mappedPubAddresses,
}: {
  mappedPubAddresses: PubAddress[];
}): UseSocialMediaLinksContext => {
  return {
    links: mappedPubAddresses
      .filter((address) => address.chain_code === SOCIALS_CHAIN_CODE)
      .map((address) => ({
        url: address.public_address,
        title: address.token_code,
      })),
  };
};
