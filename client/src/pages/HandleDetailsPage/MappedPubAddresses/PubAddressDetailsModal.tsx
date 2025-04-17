import { FC } from 'react';
import { Modal } from 'react-bootstrap';

import { PubAddressDetails } from './PubAddressDetails';
import { TokenCodeLogo } from 'src/components/TokenCodeLogo';
import { TokenTitle } from './TokenTitle';

import { PubAddress } from '@shared/types/pub-address';

type PubAddressDetailsModalProps = {
  pubAddress: PubAddress | null;
  fch: string;
  showModal: boolean;
  handleCloseModal: () => void;
};

export const PubAddressDetailsModal: FC<PubAddressDetailsModalProps> = ({
  showModal,
  handleCloseModal,
  pubAddress,
  fch,
}) => {
  if (!pubAddress) {
    return null;
  }

  const { chain_code, token_code } = pubAddress;

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered size="lg" contentClassName="bg-light">
      <Modal.Header closeButton className="p-4">
        <Modal.Title>
          <div className="d-flex justify-content-between align-items-center gap-4">
            <TokenCodeLogo chainCode={chain_code} tokenCode={token_code} />
            <TokenTitle address={pubAddress} />
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <PubAddressDetails pubAddress={pubAddress} fch={fch} />
      </Modal.Body>
    </Modal>
  );
};
