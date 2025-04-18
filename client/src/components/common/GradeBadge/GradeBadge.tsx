import React from 'react';

import styles from './GradeBadge.module.scss';

type Props = {
  grade: string;
};

export const GradeBadge: React.FC<Props> = ({ grade }) => {
  if (!grade) return null;
  
  let color;

  switch (true) {
    case grade.includes('A'):
      color = 'isGreen';
      break;
    case grade.includes('B'):
      color = 'isYellow';
      break;
    case grade.includes('C'):
      color = 'isOrange';
      break;
    case grade.includes('D'):
      color = 'isRose';
      break;
    case grade.includes('F'):
      color = 'isRed';
      break;
    default:
      break;
  }

  return (
    <div className={`d-flex align-items-center justify-content-center f-size-sm px-2 py-2 rounded-3 f-size-xs ${styles.container} ${color ? styles[color] : ''}`}>{grade}</div>
  );
};
