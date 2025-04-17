import { FC } from 'react';

import { TOKEN_CODE_MAP } from 'src/constants/token-codes';
import { CHAIN_CODE_MAP } from 'src/constants/chain-codes';

import { PubAddress } from '@shared/types/pub-address';

export const TokenTitle: FC<{ address: PubAddress }> = ({ address }) => {
  if (address.token_code === '*') {
    return (
      <div>
        <span className="fw-bold">
          {CHAIN_CODE_MAP[`${address.chain_code}`]?.name || address.chain_code} Tokens
        </span>
      </div>
    );
  }

  return (
    <div>
      <span className="fw-bold">
        {TOKEN_CODE_MAP[`${address.chain_code}_${address.token_code}`]?.name || address.token_code}
      </span>
      {address.chain_code !== address.token_code ? (
        <> ({CHAIN_CODE_MAP[address.chain_code]?.name || address.chain_code})</>
      ) : null}
    </div>
  );
};
