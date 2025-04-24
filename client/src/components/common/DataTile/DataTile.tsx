import React, { ReactNode, ReactElement } from 'react';
import { Card, ListGroup, Row, Col } from 'react-bootstrap';

import { CardComponent } from '../../layout/CardComponent';
import { Loader } from '../Loader';

import styles from './DataTile.module.scss';

export interface DataItem {
  title: string;
  value: string | number | ReactElement | null;
}

export type LayoutType = 'column' | 'row' | 'multi-column';

export interface DataTileProps {
  children?: ReactNode;
  className?: string;
  columns?: number;
  items: DataItem[];
  layout?: LayoutType;
  title?: string;
  loading?: boolean;
}

// Row layout component
interface RowLayoutProps {
  items: DataItem[];
}

const RowLayout: React.FC<RowLayoutProps> = ({ items }) => (
  <Row className="d-flex flex-row gap-3 flex-wrap m-0 w-100">
    {items.map((item, index) => (
      <Col key={index} className={`flex-grow-1 p-0 ${styles.dataItemCol}`}>
        <div
          className={`d-flex align-items-center w-100 bg-transparent p-3 rounded-1 border-0 ${styles.dataItem} ${styles.dataItemRow}`}
        >
          <div className="d-flex flex-column gap-1 align-items-start">
            <div className={styles.dataItemTitle}>{item.title}</div>
            <div className={styles.dataItemValue}>{item.value}</div>
          </div>
        </div>
      </Col>
    ))}
  </Row>
);

// Reusable DataItem component for list group items
interface DataItemListGroupItemProps {
  item: DataItem;
}

const DataItemListGroupItem: React.FC<DataItemListGroupItemProps> = ({ item }) => (
  <ListGroup.Item className={`${styles.dataItem} py-2 ps-3 pe-0 border-bottom`}>
    <div>
      <div className={styles.dataItemTitle}>{item.title}</div>
      <div className={styles.dataItemValue}>{item.value}</div>
    </div>
  </ListGroup.Item>
);

// Reusable DataItemsList component
interface DataItemsListProps {
  items: DataItem[];
  keyPrefix?: string;
}

const DataItemsList: React.FC<DataItemsListProps> = ({ items, keyPrefix = '' }) => (
  <ListGroup variant="flush" className="d-flex flex-column gap-3 p-0 w-100 border-0">
    {items.map((item, index) => (
      <DataItemListGroupItem key={`${keyPrefix}${index}`} item={item} />
    ))}
  </ListGroup>
);

// Multi-column layout component
interface MultiColumnLayoutProps {
  items: DataItem[];
  columns: number;
}

const MultiColumnLayout: React.FC<MultiColumnLayoutProps> = ({ items, columns }) => {
  // Calculate items per column
  const itemsPerCol = Math.ceil(items.length / columns);

  return (
    <Row className="d-flex w-100 m-0 gap-3">
      {Array.from({ length: columns }).map((_, colIndex) => {
        // Get items for this column
        const colItems = items.slice(colIndex * itemsPerCol, (colIndex + 1) * itemsPerCol);

        return (
          <Col key={colIndex} className="p-0">
            <DataItemsList items={colItems} keyPrefix={`col-${colIndex}-`} />
          </Col>
        );
      })}
    </Row>
  );
};

// Column layout component
interface ColumnLayoutProps {
  items: DataItem[];
}

const ColumnLayout: React.FC<ColumnLayoutProps> = ({ items }) => <DataItemsList items={items} />;

export const DataTile: React.FC<DataTileProps> = ({
  children,
  className = '',
  columns = 2,
  items,
  layout = 'column',
  title,
  loading = false,
}) => {
  const renderItems = (): ReactNode => {
    switch (layout) {
      case 'row':
        return <RowLayout items={items} />;
      case 'multi-column':
        return <MultiColumnLayout items={items} columns={columns} />;
      default:
        return <ColumnLayout items={items} />;
    }
  };

  return (
    <CardComponent title={title} className={className}>
      <Card.Body className="d-flex flex-column gap-3 p-0">
        <div className="w-100 d-flex flex-column flex-md-row gap-4">
          <div className="w-100">{renderItems()}</div>
          {children && (
            <div
              className={`w-100 border-start border-1 border-mercury ${styles.childrenContainer}`}
            >
              {children}
            </div>
          )}
        </div>
        {loading && <Loader fullScreen />}
      </Card.Body>
    </CardComponent>
  );
};

export default DataTile;
