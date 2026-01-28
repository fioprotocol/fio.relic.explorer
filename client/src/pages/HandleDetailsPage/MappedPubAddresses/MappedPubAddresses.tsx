import { FC } from 'react';
import { Button } from 'react-bootstrap';

import { ReactComponent as ChevronRight } from 'src/assets/icons/chevron-right-lg.svg';

import { Alert } from 'src/components/common/Alert';
import { TokenCodeLogo } from 'src/components/TokenCodeLogo';
import { TokenTitle } from './TokenTitle';
import { PubAddressDetailsModal } from './PubAddressDetailsModal';

import { useMappedPubAddressesContext } from './MappedPubAddressesContext';

import { PubAddress } from '@shared/types/pub-address';

export const MappedPubAddresses: FC<{ mappedPubAddresses: PubAddress[]; fch: string }> = ({
  mappedPubAddresses,
  fch,
}) => {
  const { pubAddresses, selectedAddress, showModal, handleCloseModal, handleShowModal } =
    useMappedPubAddressesContext({ mappedPubAddresses });

  if (pubAddresses.length === 0)
    return (
      <Alert
        variant="danger"
        title="No Mapped Public Addresses"
        message="There are no mapped public FIO addresses associated with this FIO Handle."
      />
    );

  return (
    <div className="d-flex flex-column gap-2">
      {pubAddresses.map((address) => (
        <Button
          key={`${address.chain_code}_${address.token_code}`}
          className="d-flex justify-content-between align-items-center px-3 py-3 border-0"
          variant="light"
          onClick={(): void => handleShowModal(address)}
        >
          <div className="d-flex justify-content-between align-items-center gap-4 ms-2">
            <TokenCodeLogo chainCode={address.chain_code} tokenCode={address.token_code} />
            <TokenTitle address={address} />
          </div>
          <ChevronRight />
        </Button>
      ))}

      <PubAddressDetailsModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        pubAddress={selectedAddress}
        fch={fch}
      />
    </div>
  );
};

export default MappedPubAddresses;
