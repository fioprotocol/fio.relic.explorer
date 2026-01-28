import BigNumber from 'big.js';

import { Badge } from 'src/components/common/Badge';

export const IrreversibleStatus: React.FC<{
  blockNumber: number | null | undefined;
  lastIrreversibleBlockNumber: number | null | undefined;
}> = ({ blockNumber, lastIrreversibleBlockNumber }) => {
  if (!blockNumber || !lastIrreversibleBlockNumber) return null;

  const isIrreversible = new BigNumber(blockNumber).lte(lastIrreversibleBlockNumber);

  return (
    <Badge variant="warning">{isIrreversible ? 'Irreversible' : 'Pending Irreversibility'}</Badge>
  );
};
