import React from 'react';

import { ReactComponent as FioLogoDark } from '../../assets/logo-dark.svg';
import { ReactComponent as FioLogoLight } from '../../assets/logo-light.svg';

interface FioLogoProps {
  variant?: 'light' | 'dark';
  height?: number;
}

export const FioLogo: React.FC<FioLogoProps> = ({ variant = 'dark', height = 40 }) => {
  if (variant === 'dark') {
    return <FioLogoDark height={height} />;
  }

  return <FioLogoLight height={height} />;
};
