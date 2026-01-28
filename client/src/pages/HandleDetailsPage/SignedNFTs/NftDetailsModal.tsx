import { FC, Fragment } from 'react';
import { Modal } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';

import { NftImg } from './NftImg';
import { Alert } from 'src/components/common/Alert';

import { NftItem } from './types';

import styles from './SignedNFTs.module.scss';

type NftDetailsModalProps = {
  nft: NftItem | null;
  showModal: boolean;
  handle: string;
  handleCloseModal: () => void;
};

const DescriptionListComponent: React.FC<{ items: (string | string[])[] }> = ({ items }) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={Array.isArray(item) ? item[0] : item}>
          {Array.isArray(item) ? (
            <Fragment>
              <p>{item[0]}:</p>
              <DescriptionListComponent items={item.slice(1)} />
            </Fragment>
          ) : (
            item
          )}
        </li>
      ))}
    </ul>
  );
};

const KeyValueTile: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <div className="d-flex justify-content-start align-items-start gap-2 mb-3 flex-wrap">
      <span>{label}:</span>
      <span className="fw-bold flex-grow-1 text-break">{value}</span>
    </div>
  );
};

export const NftDetailsModal: FC<NftDetailsModalProps> = ({
  showModal,
  handleCloseModal,
  nft,
  handle,
}) => {
  if (!nft) {
    return null;
  }

  const { isAlteredImage, externalProviderMetadata, viewNftLink } = nft;
  const { description, name } = externalProviderMetadata || {};

  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      centered
      size="lg"
      contentClassName="bg-light"
    >
      <Modal.Header closeButton className="p-4">
        <Modal.Title>
          <div className="d-flex justify-content-between align-items-center gap-4">
            NFT Signature Information
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <p className="">
          <span className="">This NFT was signed by</span>
          <span className="ms-2 fw-bold">{handle}</span>
        </p>
        <KeyValueTile label="Contract address" value={nft.contractAddress} />
        {nft.hasMultipleSignatures ? (
          <Alert
            title="NFT Signature"
            message="This signature applies to all images within this contract."
          />
        ) : (
          <>
            <div className="d-flex justify-content-between gap-4 flex-lg-row flex-column">
              <div className="d-flex flex-column align-items-center gap-2">
                <div
                  className={`w-100 bg-white p-3 rounded-3 text-center d-flex justify-content-center align-items-center ${styles.nftImgContainer}`}
                >
                  <div className={`w-100 ${styles.nftItem}`}>
                    <NftImg nftItem={nft} />
                  </div>
                </div>
                {viewNftLink && (
                  <a
                    href={viewNftLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link fw-bold"
                  >
                    View NFT
                  </a>
                )}
              </div>
              <div className="flex-grow-1">
                <Alert
                  title={
                    isAlteredImage ? 'Image Altered Since Signed' : 'Image Not Altered Since Signed'
                  }
                  variant={isAlteredImage ? 'warning' : 'info'}
                  hasDash={false}
                  icon={isAlteredImage ? <ExclamationTriangleFill size={20} /> : null}
                  className="mb-3"
                />
                {name && <KeyValueTile label="Name" value={name} />}
                <KeyValueTile label="Token ID" value={nft.tokenId} />
                <KeyValueTile label="Creator URL" value={nft.creatorUrl || ''} />
              </div>
            </div>
            {description && description.length > 0 && (
              <div className="mt-4">
                <p className="mb-2">Description</p>
                <ul className="fw-bold">
                  {description?.map((descriptionItem) => (
                    <li key={Array.isArray(descriptionItem) ? descriptionItem[0] : descriptionItem}>
                      {Array.isArray(descriptionItem) ? (
                        <Fragment>
                          <p>{descriptionItem[0]}</p>
                          <DescriptionListComponent items={descriptionItem.slice(1)} />
                        </Fragment>
                      ) : (
                        descriptionItem
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};
