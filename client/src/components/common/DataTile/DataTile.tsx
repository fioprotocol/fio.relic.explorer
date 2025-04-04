import React, { ReactNode, ReactElement } from 'react';
import { Card, ListGroup, Row, Col } from 'react-bootstrap';
import { CardComponent } from '../../layout/CardComponent';
import styles from './DataTile.module.scss';

export interface DataItem {
  title: string;
  value: string | number | ReactElement;
}

export type LayoutType = 'column' | 'row' | 'multi-column';

export interface DataTileProps {
  children?: ReactNode;
  className?: string;
  columns?: number;
  items: DataItem[];
  layout?: LayoutType;
  title?: string;
}

export const DataTile: React.FC<DataTileProps> = ({ 
  children,
  className = '',
  columns = 2,
  items,
  layout = 'column',
  title
}) => {
  const renderItems = (): ReactNode => {
    if (layout === 'row') {
      return (
        <Row className={styles['data-items-row']}>
          {items.map((item, index) => (
            <Col key={index} className={styles['data-item-col']}>
              <div className={`${styles['data-item']} ${styles['data-item-row']}`}>
                <div className={styles['data-item-content']}>
                  <div className={styles['data-item-title']}>{item.title}</div>
                  <div className={styles['data-item-value']}>{item.value}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      );
    } else if (layout === 'multi-column') {
      // Calculate items per column
      const itemsPerCol = Math.ceil(items.length / columns);
      
      return (
        <Row className={styles['data-items-multi-col']}>
          {Array.from({ length: columns }).map((_, colIndex) => {
            // Get items for this column
            const colItems = items.slice(
              colIndex * itemsPerCol,
              (colIndex + 1) * itemsPerCol
            );
            
            return (
              <Col key={colIndex} className={styles['data-items-col']}>
                <ListGroup variant="flush" className={styles['data-items']}>
                  {colItems.map((item, itemIndex) => (
                    <ListGroup.Item 
                      key={`${colIndex}-${itemIndex}`} 
                      className={styles['data-item']}
                    >
                      <div className={styles['data-item-content']}>
                        <div className={styles['data-item-title']}>{item.title}</div>
                        <div className={styles['data-item-value']}>{item.value}</div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            );
          })}
        </Row>
      );
    } else {
      // Default column layout
      return (
        <ListGroup variant="flush" className={styles['data-items']}>
          {items.map((item, index) => (
            <ListGroup.Item key={index} className={styles['data-item']}>
              <div className={styles['data-item-content']}>
                <div className={styles['data-item-title']}>{item.title}</div>
                <div className={styles['data-item-value']}>{item.value}</div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      );
    }
  };

  return (
    <CardComponent title={title} className={className}>
      <Card.Body className={styles['data-tile-content']}>
        {renderItems()}
        {children && <div className={styles['data-tile-children']}>{children}</div>}
      </Card.Body>
    </CardComponent>
  );
};

export default DataTile; 