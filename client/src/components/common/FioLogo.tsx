import React from 'react';

interface FioLogoProps {
  variant?: 'light' | 'dark';
  height?: number;
}

export const FioLogo: React.FC<FioLogoProps> = ({ variant = 'dark', height = 40 }) => {
  return (
    <img
      src={`/images/logo-${variant}.png`}
      alt="FIO Protocol"
      height={height}
      style={{ width: 'auto' }}
    />
  );
}; 