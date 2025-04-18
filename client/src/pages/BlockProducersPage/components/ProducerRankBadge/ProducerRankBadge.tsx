import { FC } from 'react';
import { Badge } from 'src/components/common/Badge';

import styles from './ProducerRankBadge.module.scss';

type ProducerRankBadgeProps = {
  index: number;
  topRank?: number;
};

export const ProducerRankBadge: FC<ProducerRankBadgeProps> = ({ index, topRank = 21 }) => {
  if (index > topRank) return null;

  return (
    <Badge
      variant="dark"
      textVariant="white"
      className={`d-flex align-items-center justify-content-center px-2 py-2 f-size-xs ${styles.topBadge}`}
    >
      TOP {topRank}
    </Badge>
  );
};
