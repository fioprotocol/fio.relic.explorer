import { FC, ReactNode } from 'react';

import styles from './DetailsPagesHeaderItem.module.scss';

type DetailsPagesHeaderItemProps = {
  title: string;
  value: string | number | ReactNode | undefined;
  inTheSameRow?: boolean;
};

export const DetailsPagesHeaderItem: FC<DetailsPagesHeaderItemProps> = ({
  title,
  value,
  inTheSameRow = false
}) => {
  return <div className='d-flex flex-row gap-2 f-size-sm'>
    {inTheSameRow ? (
      <p className={`text-secondary mb-0 lh-4 ${styles.wrapValue}`}>
        {title} <span className='text-dark fw-bold'>{value}</span>
      </p>
    ) : (
      <>
        <p className="text-secondary mb-0 lh-4 text-wrap flex-shrink-0">
          {title}
        </p>
        <div className='text-dark fw-bold m-0'>
          {value}
        </div>
      </>
    )}
  </div>
};
