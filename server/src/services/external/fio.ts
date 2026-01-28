import { createHash } from 'crypto';

import { isDomain } from '@shared/util/fio';

export const setTableRowsParams = (
  fioName: string
): {
  code: string;
  scope: string;
  table: string;
  lower_bound: string;
  upper_bound?: string;
  key_type?: string;
  index_position?: string;
  json?: boolean;
  reverse?: boolean;
  limit?: number;
} => {
  const hash = createHash('sha1');
  const bound = '0x' + hash.update(fioName).digest().slice(0, 16).reverse().toString('hex');

  const params = {
    code: 'fio.address',
    scope: 'fio.address',
    table: 'fionames',
    lower_bound: bound,
    upper_bound: bound,
    key_type: 'i128',
    index_position: '5',
    json: true,
  };

  if (isDomain(fioName)) {
    params.table = 'domains';
    params.index_position = '4';
  }

  return params;
};
