import React from 'react';
import { Link } from 'react-router';

import { TransformedTransaction, Transaction } from '@shared/types/transactions';
import { formatFioAmount } from 'src/utils/fio';
import { formatDate, truncateLongText } from './general';
import { ROUTES } from 'src/constants/routes';
import { ACTION_NAMES, ActionInfo } from 'src/constants/actionNames';

export const transformTransactions = ({
  pk_transaction_id,
  transaction_id,
  account_name,
  action_name,
  block_timestamp,
  request_data,
  fee,
}: Transaction): TransformedTransaction => {
  const account = React.createElement(Link, { 
    to: `${ROUTES.accounts.path}/${account_name}`, 
    className: 'text-primary text-decoration-none',
  }, account_name);

  const transactionData = React.createElement(Link, {
    to: `${ROUTES.transactions.path}/${transaction_id}`,
    className: 'text-primary text-decoration-none',
  }, truncateLongText(transaction_id));

  const actionInfo = (ACTION_NAMES as Record<string, ActionInfo>)[action_name] || { description: action_name };
  
  let details = null;
  if (actionInfo.formatDetails) {
    details = actionInfo.formatDetails(JSON.parse(request_data));
  } else if (actionInfo.details && request_data) {
    details = JSON.parse(request_data)[actionInfo.details] || details;
  }
  
  return {
    id: pk_transaction_id,
    transactionId: transactionData,
    account,
    action: actionInfo.description || action_name,
    date: formatDate(block_timestamp),
    details,
    fee: formatFioAmount(fee),
  };
};
