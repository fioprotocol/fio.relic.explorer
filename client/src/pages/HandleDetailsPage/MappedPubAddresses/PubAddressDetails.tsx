import { FC } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from 'react-bootstrap';

import { Alert } from 'src/components/common/Alert';

import { TOKEN_CODE_MAP } from 'src/constants/token-codes';
import { CHAIN_CODE_MAP } from 'src/constants/chain-codes';

import { PubAddress } from '@shared/types/pub-address';

export const PubAddressDetails: FC<{ pubAddress: PubAddress | null; fch: string }> = ({
  pubAddress,
  fch,
}) => {
  if (!pubAddress) {
    return null;
  }

  const { chain_code, token_code, public_address } = pubAddress;
  const tokenCodeName = TOKEN_CODE_MAP[token_code]?.name;
  const chainCodeName = CHAIN_CODE_MAP[chain_code]?.name;

  return (
    <>
      {chainCodeName !== tokenCodeName && (
        <Alert variant="info" title={chainCodeName}>
          {token_code ? (
            <span>
              You're sending {tokenCodeName} ({token_code}) on the {chainCodeName} chain.{' '}
              <span className="boldText">Please make sure this is correct.</span>
            </span>
          ) : (
            <span>You can send any {chainCodeName} token to this address.</span>
          )}
        </Alert>
      )}

      <p className="fw-bold my-4">
        FIO Handle: <span>{fch}</span>
      </p>
      <Card className="mb-2 bg-white shadow-sm d-inline-block" border='0'>
        <Card.Body>
          <QRCodeSVG value={public_address} />
        </Card.Body>
      </Card>
      <p className="my-3">Mapped Address</p>
      <p className="copy">{public_address}</p>
    </>
  );
};
