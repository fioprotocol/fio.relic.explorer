import React from 'react';
import { Container as BootstrapContainer } from 'react-bootstrap';

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className, title }) => {
  return (
    <BootstrapContainer className={`gx-5 gx-xxl-4 ${className || ''}`} fluid="xxl">
      {title && <h4 className="mb-4 mt-4">{title}</h4>}
      {children}
    </BootstrapContainer>
  );
};

export default Container;
