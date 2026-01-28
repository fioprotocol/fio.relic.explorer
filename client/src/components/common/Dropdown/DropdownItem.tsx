import React from 'react';
import { Button } from 'react-bootstrap';

import { Variant } from 'react-bootstrap/esm/types';

type DropdownItemProps = {
  'aria-selected'?: boolean;
  'aria-disabled'?: boolean;
  children: React.ReactNode;
  variant?: Variant;
  customClassName?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const DropdownItem = React.forwardRef(
  (
    {
      children,
      variant,
      customClassName,
      onClick,
      'aria-selected': active,
      'aria-disabled': disabled,
    }: DropdownItemProps,
    ref: React.Ref<HTMLButtonElement & { disabled: boolean }>
  ) => (
    <Button
      variant={variant || 'link'}
      className={
        customClassName ||
        'd-flex align-items-center gap-2 text-dark fw-normal-inter f-size-sm w-100 border-bottom border-bottom-light rounded-0 px-0 text-decoration-none opacity-75-hover'
      }
      ref={ref}
      onClick={(e): void => {
        e.preventDefault();
        onClick(e);
      }}
      disabled={disabled || active}
    >
      {children}
    </Button>
  )
);
