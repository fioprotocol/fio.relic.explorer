import { useCallback, useState } from 'react';

import { getSignedNFTs } from 'src/services/fio';

import { useLoadMoreData } from 'src/hooks/useLoadMoreData';

import { DEFAULT_LIMIT } from './constants';

import { HandleNFT } from '@shared/types/handles';
import { NftItem } from './types';

type UseSignedNFTsContext = {
  nfts: HandleNFT[];
  loading: boolean;
  hasMore: boolean;
  showModal: boolean;
  activeNftItem: NftItem | null;
  onModalClose: () => void;
  onItemClick: (nftItem: NftItem) => void;
  loadMore: () => void;
};

export const useSignedNFTsContext = ({ handle }: { handle: string }): UseSignedNFTsContext => {
  const [showModal, toggleModal] = useState<boolean>(false);
  const [activeNftItem, setActiveNftItem] = useState<NftItem | null>(null);

  const {
    data: nfts,
    hasMore,
    loadMore,
    loading,
  } = useLoadMoreData<HandleNFT>({
    action: getSignedNFTs,
    params: { fch: handle },
    dataKey: 'nfts',
    itemIdKey: 'token_id',
    limit: DEFAULT_LIMIT,
  });

  const onModalClose = useCallback(async () => {
    toggleModal(false);
    setActiveNftItem(null);
  }, []);

  const onItemClick = useCallback((nftItem: NftItem) => {
    setActiveNftItem(nftItem);
    toggleModal(true);
  }, []);

  return {
    nfts: nfts || [],
    loading,
    hasMore,
    onModalClose,
    onItemClick,
    loadMore,
    showModal,
    activeNftItem,
  };
};
