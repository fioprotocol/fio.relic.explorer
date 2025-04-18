import { FC, SyntheticEvent } from 'react';

import defaultLogo from 'src/assets/no-bp-icon.svg';

import styles from './ProducerInfo.module.scss';

type ProducerInfoProps = {
  name: string;
  logo: string;
};

export const ProducerInfo: FC<ProducerInfoProps> = ({ name, logo }) => {
  const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>): void => {
    (e.target as HTMLImageElement).src = defaultLogo;
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <div className="d-flex justify-content-center align-items-center me-2">
        <img 
          src={logo} 
          alt={name} 
          className={styles.bpLogo}
          onError={handleImageError}
        />
      </div>
      <span className="text-primary">{name}</span>
    </div>
  );
};
