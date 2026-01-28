import { useState } from 'react';

import { SOCIALS_CHAIN_CODE } from '@shared/constants/pub-address';
import { PubAddress } from '@shared/types/pub-address';

type UseMappedPubAddressesContext = {
  pubAddresses: PubAddress[];
  selectedAddress: PubAddress | null;
  showModal: boolean;
  handleCloseModal: () => void;
  handleShowModal: (address: PubAddress) => void;
};

export const useMappedPubAddressesContext = ({
  mappedPubAddresses,
}: {
  mappedPubAddresses: PubAddress[];
}): UseMappedPubAddressesContext => {
  const [selectedAddress, setSelectedAddress] = useState<PubAddress | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleCloseModal = (): void => setShowModal(false);
  const handleShowModal = (address: PubAddress): void => {
    setSelectedAddress(address);
    setShowModal(true);
  };

  return {
    pubAddresses: mappedPubAddresses.filter((address) => address.chain_code !== SOCIALS_CHAIN_CODE),
    selectedAddress,
    showModal,
    handleCloseModal,
    handleShowModal,
  };
};
