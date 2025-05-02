import { ReactNode } from 'react';

import { ArrowUpShort, ArrowDownShort } from 'react-bootstrap-icons';
import { Link } from 'react-router';

import { AccountTransaction } from '@shared/types/accounts';

import { Badge } from 'src/components/common/Badge';
import { CopyButton } from 'src/components/common/CopyButton';

import { ROUTES } from 'src/constants/routes';

import { formatDate, truncateLongText } from 'src/utils/general';
import { transformActionInfo, transformDetails } from 'src/utils/transactions';
import { formatFioAmount } from 'src/utils/fio';

import { TRANSACTION_TYPE } from '@shared/constants/transaction';

import styles from '../Transactions.module.scss';


type TransactionsDesktopProps = {
  transactions: AccountTransaction[];
};

export const transactionsDesktop = ({ transactions }: TransactionsDesktopProps): {
  className: string;
  status: ReactNode;
  transaction_hash: ReactNode;
  date: string;
  action: string;
  details: string | ReactNode;
  fee: ReactNode;
  fio_tokens: ReactNode;
}[] => {
  return transactions.map(
    ({
      transaction_type,
      transaction_id,
      block_timestamp,
      action_name,
      request_data,
      fee,
      fio_tokens,
    }) => {
      const isSender = transaction_type === TRANSACTION_TYPE.SENDER;
      const isReceiver = transaction_type === TRANSACTION_TYPE.RECEIVER;

      const hasFees = fee && fee !== '0';
      const hasFioTokens = fio_tokens && fio_tokens !== '0';

      return {
        className: isSender ? styles.senderRow : '',
        status: isSender ? (
          <Badge textVariant="white" className={`${styles.badge} ${styles.badgeSender}`}>
            <ArrowUpShort size={20} />
          </Badge>
        ) : isReceiver ? (
          <Badge textVariant="white" className={`${styles.badge} ${styles.badgeReceiver}`}>
            <ArrowDownShort size={20} />
          </Badge>
        ) : null,
        transaction_hash: (
          <div className="d-flex flex-row align-items-center justify-content-between gap-2">
            <Link
              to={`${ROUTES.transactions.path}/${transaction_id}`}
              className="flex-shrink-0"
            >
              {truncateLongText(transaction_id?.toString())}
            </Link>
            <CopyButton
              data={transaction_id}
              className="bg-transparent border-0 text-dark"
              showCopyIcon
            />
          </div>
        ),
        date: formatDate(block_timestamp),
        action: transformActionInfo(action_name)?.description,
        details: transformDetails({
          actionInfo: transformActionInfo(action_name),
          request_data,
          className: isSender ? 'text-danger' : isReceiver ? styles.receiver : '',
        }),
        fee:
          hasFees ? (
            <span
              className={`f-size-xs ${isSender ? 'text-danger' : isReceiver ? 'text-secondary' : 'text-dark'}`}
            >
              {isSender ? '-' : ''}
              {formatFioAmount({ amount: fee })}
            </span>
          ) : null,
        fio_tokens:
          hasFioTokens || hasFees ? (
            <Badge
              className={`border border-1 bg-white f-size-xs ${styles.tokenBadge} ${!hasFioTokens ? 'border-secondary text-secondary' : isSender ? 'border-danger text-danger' : isReceiver ? styles.receiver : ''}`}
            >
              {isReceiver ? hasFioTokens ? '+' : '-' : '-'}
              {formatFioAmount({ amount: fio_tokens || fee })}
            </Badge>
          ) : null,
      };
    }
  )
};
