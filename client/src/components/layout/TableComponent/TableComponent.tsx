import React from 'react';
import { Table as BootstrapTable, Card } from 'react-bootstrap';

import styles from './TableComponent.module.scss';

export interface TableColumn {
  key: string;
  title: string;
  align?: 'start' | 'center' | 'end';
}

export interface TableProps {
  columns: TableColumn[];
  data: { [key: string]: string | number | React.ReactNode }[];
  title?: string;
  className?: string;
  customMobileDesign?: React.ReactNode;
}

export const TableComponent: React.FC<TableProps> = ({ columns, data, title, className, customMobileDesign }) => {
  return (
    <Card className={`bg-transparent border-0 rounded-0 mb-4 overflow-hidden ${className || ''}`}>
      {title && (
        <Card.Header
          className={`bg-transparent border-bottom py-3 px-4 text-dark ${styles.tableHeader}`}
        >
          {title}
        </Card.Header>
      )}
      <Card.Body className="p-0">
        <div className="d-none d-lg-block">
          <BootstrapTable responsive hover className="m-0">
            <thead>
              <tr className={styles.thead}>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`py-3 px-4 bg-transparent ${column.align ? `text-${column.align}` : ''}`}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {data.map((record, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td
                      key={`${index}-${column.key}`}
                      className={`py-3 px-4 bg-transparent ${column.align ? `text-${column.align}` : ''}`}
                    >
                      {record[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </BootstrapTable>
        </div>

        <div className="d-block d-lg-none">
          {customMobileDesign ? customMobileDesign :
            data.map((record, index) => (
              <div key={index} className={`p-3 border-bottom d-flex flex-row flex-wrap gap-4 ${styles.mobileRow}`}>
                {columns.map((column) => (
                  <div
                    key={`mobile-${index}-${column.key}`}
                    className={`d-flex flex-column mb-2 ${styles.mobileItem}`}
                  >
                    <div className={`mb-1 ${styles.mobileLabel}`}>{column.title}</div>
                    <div className={styles.mobileValue}>
                      {record[column.key]}
                    </div>
                  </div>
                ))}
              </div>
            ))
          }
        </div>
      </Card.Body>
    </Card>
  );
};
