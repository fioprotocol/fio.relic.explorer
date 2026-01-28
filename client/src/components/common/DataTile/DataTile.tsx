import React, { ReactNode, ReactElement, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

import { CardComponent } from '../../layout/CardComponent';
import { Loader } from '../Loader';

import styles from './DataTile.module.scss';

export interface DataItem {
  title: string;
  value: string | number | ReactElement | null;
  wideWidth?: boolean;
  narrowWidth?: boolean;
}

export interface DataTileProps {
  children?: ReactNode;
  className?: string;
  columns?: number;
  items: DataItem[];
  title?: string;
  loading?: boolean;
}

// Reusable DataItem component
interface DataItemComponentProps {
  item: DataItem;
  isRow?: boolean;
}

const DataItemComponent: React.FC<DataItemComponentProps> = ({ item, isRow = false }) => (
  <div
    className={`${styles.dataItem} ${isRow ? styles.dataItemRow : 'py-2 ps-3 pe-0'}`}
  >
    <div className="d-flex flex-column gap-1 align-items-start">
      <div className={styles.dataItemTitle}>{item.title}</div>
      <div className={styles.dataItemValue}>{item.value}</div>
    </div>
  </div>
);

export const DataTile: React.FC<DataTileProps> = ({
  children,
  className = '',
  columns = 1,
  items,
  title,
  loading = false,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Create grid template columns string
  const getGridTemplateColumns = (): string => {
    // On mobile, use the default template
    if (isMobile) {
      return `repeat(1, 1fr)`;
    }
    
    const templateParts: string[] = [];
    
    // Calculate how many items to show per row
    const itemsPerRow = Math.min(columns, items.length);
    
    // Create the template parts for each item in a row
    for (let i = 0; i < itemsPerRow; i++) {
      const item = items[i % items.length];
      
      if (item.narrowWidth) {
        templateParts.push('150px');
      } else if (item.wideWidth) {
        templateParts.push('1.8fr');
      } else {
        templateParts.push('1fr');
      }
    }
    
    return templateParts.join(' ');
  };
  
  // Calculate which items are in the last row
  const isLastRow = (index: number): boolean => {
    if (isMobile) {
      // On mobile, only the very last item is in the "last row"
      return index === items.length - 1;
    }
    
    // For desktop, calculate based on columns
    const itemsPerRow = Math.min(columns, items.length);
    const totalRows = Math.ceil(items.length / itemsPerRow);
    const lastRowStartIndex = (totalRows - 1) * itemsPerRow;
    
    return index >= lastRowStartIndex;
  };

  return (
    <CardComponent title={title} className={className}>
      <Card.Body className="d-flex flex-column gap-3 p-0">
        <div className="w-100 d-flex flex-column flex-md-row gap-4">
          <div 
            className="w-100"
            style={{ 
              gridTemplateColumns: getGridTemplateColumns(),
              display: 'grid',
              gap: '1rem'
            }}
          >
            {items.map((item, index) => (
              <div 
                key={index} 
                className={`${styles.gridItem} ${isLastRow(index) ? styles.lastRow : ''}`}
              >
                <DataItemComponent item={item} />
              </div>
            ))}
          </div>
          {children && (
            <div
              className={`w-100 border-start border-1 border-mercury ${styles.childrenContainer}`}
            >
              {children}
            </div>
          )}
        </div>
        {loading && <Loader fullScreen absolute />}
      </Card.Body>
    </CardComponent>
  );
};

export default DataTile;
