import React from 'react';
import { Link } from 'react-router';

import { TransformedTransaction } from '@shared/types/transactions';

import { formatFioAmount } from 'src/utils/fio';
import { formatDate, truncateLongText } from './general';
import { ROUTES } from 'src/constants/routes';
import { ACTION_NAMES, ActionInfo } from 'src/constants/actionNames';

export const transformAccountName = (account_name: string): React.ReactNode => {
  return React.createElement(Link, {
    to: `${ROUTES.accounts.path}/${account_name}`,
    className: 'text-primary text-decoration-none',
  }, account_name);
};

export const transformActionInfo = (action_name: string): ActionInfo => {
  return (ACTION_NAMES as Record<string, ActionInfo>)[action_name] || { description: action_name };
};

export const transformDetails = ({
  actionInfo,
  request_data,
}: {
  actionInfo: ActionInfo;
  request_data?: string;
}): string | null => {
  let details = null;

  if (actionInfo.formatDetails && request_data) {
    details = actionInfo.formatDetails(JSON.parse(request_data));
  } else if (actionInfo.details && request_data) {
    details = JSON.parse(request_data)[actionInfo.details] || details;
  }
  return details;
};

export const transformTransactions = ({
  pk_transaction_id,
  transaction_id,
  account_name,
  action_name,
  block_timestamp,
  request_data,
  fee,
}: {
  pk_transaction_id: string;
  transaction_id: string;
  account_name: string;
  action_name: string;
  block_timestamp: string;
  request_data?: string;
  fee: string;
}): TransformedTransaction => {
  const account = transformAccountName(account_name);

  const transactionData = React.createElement(
    Link,
    {
      to: `${ROUTES.transactions.path}/${transaction_id}`,
      className: 'text-primary text-decoration-none',
    },
    truncateLongText(transaction_id)
  );

  const actionInfo = transformActionInfo(action_name);

  return {
    id: pk_transaction_id,
    transactionId: transactionData,
    account,
    action: actionInfo.description || action_name,
    date: formatDate(block_timestamp),
    details: transformDetails({ actionInfo, request_data }),
    fee: formatFioAmount({ amount: fee }),
  };
};
