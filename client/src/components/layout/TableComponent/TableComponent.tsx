import React from 'react';
import { Table as BootstrapTable, Card } from 'react-bootstrap';

import styles from './TableComponent.module.scss';

export interface TableColumn {
  key: string;
  title: string;
}

export interface TableProps {
  columns: TableColumn[];
  data: {[key:string]: string | number | React.ReactElement}[];
  title?: string;
  className?: string;
}

export const TableComponent: React.FC<TableProps> = ({ columns, data, title, className }) => {
  return (
    <Card className={`${styles.tableCard} ${className || ''}`}>
      {title && <Card.Header className={styles.tableHeader}>{title}</Card.Header>}
      <Card.Body className="p-0">
        <div className={styles.tableDesktop}>
          <BootstrapTable responsive hover className="m-0">
            <thead>
              <tr className={styles.thead}>
                {columns.map((column) => (
                  <th key={column.key}>{column.title}</th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {data.map((record, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={`${index}-${column.key}`}>
                      {record[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </BootstrapTable>
        </div>
        
        <div className={styles.tableMobile}>
          {data.map((record, index) => (
            <div key={index} className={`p-3 ${styles.mobileRow}`}>
              {columns.map((column) => (
                <div key={`mobile-${index}-${column.key}`} className={`d-flex flex-column mb-2 ${styles.mobileItem}`}>
                  <div className={`mb-1${styles.mobileLabel}`}>{column.title}</div>
                  <div className={styles.mobileValue}>
                    {record[column.key]}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};
