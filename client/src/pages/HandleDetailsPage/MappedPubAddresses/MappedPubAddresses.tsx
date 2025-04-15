import { FC } from 'react';

import { PubAddress } from '@shared/types/pub-address';

import { useMappedPubAddressesContext } from './MappedPubAddressesContext';

export const MappedPubAddresses: FC<{ mappedPubAddresses: PubAddress[] }> = ({
  mappedPubAddresses,
}) => {
  const { pubAddresses } = useMappedPubAddressesContext({ mappedPubAddresses });

  return pubAddresses.length > 0 ? (
    <div>
      {pubAddresses.map((address) => (
        <div key={address.public_address}>
          <div>{address.token_code}</div>
          <div>{address.chain_code}</div>
          <div>{address.public_address}</div>
        </div>
      ))}
    </div>
  ) : (
    <span>No mapped pub addresses</span>
  );
};

export default MappedPubAddresses;
