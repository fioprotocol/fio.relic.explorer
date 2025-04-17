import { FC } from 'react';

import { Alert } from 'src/components/common/Alert';
import { LoadMoreButton } from 'src/components/common/LoadMoreButton';
import { NftItem } from './NftItem';

import { useSignedNFTsContext } from './SignedNFTsContext';
import { NftDetailsModal } from './NftDetailsModal';

export const SignedNFTs: FC<{ handle: string }> = ({ handle }) => {
  const { nfts, loadMore, hasMore, onItemClick, loading, showModal, onModalClose, activeNftItem } =
    useSignedNFTsContext({ handle });

  if (nfts.length === 0)
    return (
      <Alert
        variant="danger"
        title="No Signed NFTs"
        message="There are no signed NFTs associated with this FIO Handle"
      />
    );

  return (
    <>
      <div className="w-100 d-flex justify-content-evenly flex-wrap gap-4">
        {nfts.map((nft) => (
          <NftItem key={nft.token_id} nft={nft} onClick={onItemClick} />
        ))}
      </div>
      {hasMore && (
        <div className="d-flex mt-5 justify-content-center">
          <LoadMoreButton loadMore={loadMore} loading={loading} />
        </div>
      )}
      <NftDetailsModal
        showModal={showModal}
        handleCloseModal={onModalClose}
        nft={activeNftItem}
        handle={handle}
      />
    </>
  );
};

export default SignedNFTs;
