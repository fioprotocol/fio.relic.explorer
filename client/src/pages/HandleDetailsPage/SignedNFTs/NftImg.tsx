import { FC } from 'react';

import { Loader } from 'src/components/common/Loader';

import { NftItem } from './types';

import styles from './SignedNFTs.module.scss';

export const NftImg: FC<{ nftItem: NftItem }> = ({ nftItem }) => {
  if (!nftItem) {
    return (
      <div className={styles.nftItem}>
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={`w-100 rounded-3 overflow-hidden d-flex justify-content-center align-items-center ${
        !nftItem.isImage || nftItem.hasMultipleSignatures ? styles.notImage : ''
      }`}
    >
      <img
        src={nftItem.imageUrl}
        alt={nftItem.tokenId}
        className={`rounded-3 ${!nftItem.isImage ? styles.notImage : ''}
            ${nftItem.hasMultipleSignatures ? styles.hasMultipleSignatures : ''}`}
      />
    </div>
  );
};
