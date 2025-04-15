import { HandleNFT } from '@shared/types/handles';

type UseSignedNFTsContext = {
  nfts: HandleNFT[];
};

export const useSignedNFTsContext = ({ handle }: { handle: string }): UseSignedNFTsContext => {
  return {
    nfts: [],
  };
};
