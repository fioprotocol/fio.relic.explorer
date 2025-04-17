import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Variant } from 'react-bootstrap/esm/types';

import styles from './LoadMoreButton.module.scss';

interface LoadMoreButtonProps {
  loadMore: () => void;
  text?: string;
  loading?: boolean;
  variant?: Variant;
  className?: string;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  variant = 'primary',
  className,
  loading,
  loadMore,
  text = 'Load More',
}) => {
  return (
    <Button
      variant={variant}
      className={`text-center py-2 px-3 text-uppercase ${styles.loadMoreButton} ${className || ''}`}
      onClick={loadMore}
      disabled={loading}
    >
      {loading ? <Spinner animation="border" variant="secondary" size="sm" /> : text}
    </Button>
  );
};
