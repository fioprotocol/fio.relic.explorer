import { FIO_ADDRESS_DELIMITER, NODE_URLS, FIO_API_VERSION } from '@shared/constants/fio';
import { GetTableRawsParams, GetTableRowsResponse } from '@shared/types/fio-api-server';

export const isDomain = (fioName: string): boolean => fioName.indexOf(FIO_ADDRESS_DELIMITER) < 0;

export const validateHandleRegex =
  '^(?=.{3,64}$)[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?@[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?$';

export const validateDomainRegex =
  '^(?=.{3,64}$)[a-zA-Z0-9](?:(?!-{2,})[a-zA-Z0-9-]*[a-zA-Z0-9]+)?$';

export const getTableRows = async <T>(params: GetTableRawsParams): Promise<GetTableRowsResponse<T>> => {
  const response = await fetch(`${NODE_URLS[0]}${FIO_API_VERSION}/chain/get_table_rows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  return response.json() as Promise<GetTableRowsResponse<T>>;
};
