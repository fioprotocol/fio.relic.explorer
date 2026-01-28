import { ReactElement } from 'react';
import { Dropdown } from 'react-bootstrap';
import { SortDown, CheckCircle } from 'react-bootstrap-icons';
import { DropdownToggle, DropdownItem } from 'src/components/common/Dropdown';

export interface SortOption<T> {
  label: string;
  value: T;
}

interface SortDropdownProps<T> {
  options: SortOption<T>[];
  currentSort: T;
  onSortChange: (value: T) => void;
  className?: string;
  label?: string;
}

export const SortDropdown = <T extends string>({
  options,
  currentSort,
  onSortChange,
  className = '',
  label = 'Sort',
}: SortDropdownProps<T>): ReactElement => {
  return (
    <Dropdown align="end" className={`d-flex ${className}`}>
      <Dropdown.Toggle as={DropdownToggle} className="text-dark rounded-2 gap-2">
        <SortDown size={20} className="color-primary" />
        <span className="f-size-sm ms-2">{label}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="rounded-3 py-2 px-3 border box-shadow-default">
        {options.map(({ label, value }) => (
          <Dropdown.Item
            key={value}
            as={DropdownItem}
            active={currentSort === value}
            disabled={currentSort === value}
            onClick={(): void => onSortChange(value)}
          >
            {currentSort === value && <CheckCircle size={16} className="green-icon" />}
            <span className="f-size-sm text-nowrap">{label}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}; 
