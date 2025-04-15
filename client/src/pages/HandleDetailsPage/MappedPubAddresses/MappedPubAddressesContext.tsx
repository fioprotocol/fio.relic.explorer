import { SOCIALS_CHAIN_CODE } from '@shared/constants/pub-address';
import { PubAddress } from '@shared/types/pub-address';

type UseMappedPubAddressesContext = {
  pubAddresses: PubAddress[];
};

export const useMappedPubAddressesContext = ({
  mappedPubAddresses,
}: {
  mappedPubAddresses: PubAddress[];
}): UseMappedPubAddressesContext => {
  return {
    pubAddresses: mappedPubAddresses.filter((address) => address.chain_code !== SOCIALS_CHAIN_CODE),
  };
};
