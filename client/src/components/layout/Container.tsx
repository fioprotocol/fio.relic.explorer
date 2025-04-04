import React from 'react';
import { Container as BootstrapContainer } from 'react-bootstrap';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <BootstrapContainer className={`gx-5 gx-xxl-4 ${className || ''}`} fluid="xxl">
      {children}
    </BootstrapContainer>
  );
};

export default Container;
