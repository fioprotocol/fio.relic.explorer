import { FC } from 'react';

import { useSignedNFTsContext } from './SignedNFTsContext';

export const SignedNFTs: FC<{ handle: string }> = ({ handle }) => {
  const { nfts } = useSignedNFTsContext({ handle });

  return nfts.length > 0 ? <div>{nfts.length}</div> : <span>No signed NFTs</span>;
};

export default SignedNFTs;
