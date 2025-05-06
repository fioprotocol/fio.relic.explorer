import { FC } from 'react';
import { Link } from 'react-router';
import { ArrowDownShort, ArrowUpShort } from 'react-bootstrap-icons';

import { AccountTransaction } from '@shared/types/accounts';
import { TRANSACTION_TYPE } from '@shared/constants/transaction';

import { Badge } from 'src/components/common/Badge';
import { CopyButton } from 'src/components/common/CopyButton';
import { formatDate, truncateLongText } from 'src/utils/general';
import { ROUTES } from 'src/constants/routes';
import { formatFioAmount } from 'src/utils/fio';
import { transformActionInfo, transformDetails } from 'src/utils/transactions';

import styles from '../Transactions.module.scss';

const rowClass = 'd-flex flex-row flex-wrap justify-content-between';

export const TransactionsMobile: FC<{ transactions: AccountTransaction[] }> = ({
  transactions,
}) => {
  return (
    <>
      {transactions.map(
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

          return (
            <div
              className={`border-bottom border-1 py-3 d-flex flex-column gap-3 justify-content-between ${isSender ? styles.senderRow : ''}`}
              key={transaction_id}
            >
              <div className={rowClass}>
                <div className="d-flex flex-row gap-2 align-items-center">
                  {isSender ? (
                    <Badge textVariant="white" className={`${styles.badge} ${styles.badgeSender}`}>
                      <ArrowUpShort size={20} />
                    </Badge>
                  ) : isReceiver ? (
                    <Badge
                      textVariant="white"
                      className={`${styles.badge} ${styles.badgeReceiver}`}
                    >
                      <ArrowDownShort size={20} />
                    </Badge>
                  ) : null}
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
                </div>
                {hasFioTokens || hasFees ? (
                  <Badge
                    className={`d-flex border border-1 bg-white f-size-xs align-items-center ${styles.tokenBadge} ${!hasFioTokens ? 'border-secondary text-secondary' : isSender ? 'border-danger text-danger' : isReceiver ? styles.receiver : ''}`}
                  >
                    {isReceiver ? (hasFioTokens ? '+' : '-') : '-'}
                    {formatFioAmount({ amount: fio_tokens || fee })}
                  </Badge>
                ) : null}
              </div>
              <div className={rowClass}>
                <div className="d-flex flex-row gap-1">
                  <div className="text-secondary f-size-sm">Date:</div>
                  <div className="text-dark f-size-sm">{formatDate(block_timestamp)}</div>
                </div>
                <div className="d-flex flex-row gap-1">
                  {hasFees && (
                    <>
                      <div className="text-secondary f-size-sm">Fee:</div>
                      <div className="text-dark f-size-sm">
                        <span
                          className={`f-size-xs ${isSender ? 'text-danger' : isReceiver ? 'text-secondary' : 'text-dark'}`}
                        >
                          {isSender ? '-' : ''}
                          {formatFioAmount({ amount: fee })}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className={rowClass}>
                <div className="d-flex flex-row gap-1">
                  <div className="text-secondary f-size-sm">Action:</div>
                  <div className="text-dark f-size-sm">
                    {transformActionInfo(action_name)?.description}
                  </div>
                </div>
                <div className="d-flex flex-row gap-1">
                  <div className="text-secondary f-size-sm">Details:</div>
                  <div className="text-dark f-size-sm">
                    {transformDetails({
                      actionInfo: transformActionInfo(action_name),
                      request_data,
                      className: isSender ? 'text-danger' : isReceiver ? styles.receiver : '',
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        }
      )}
    </>
  );
};
