import React from 'react';
import { Table as BootstrapTable, Card } from 'react-bootstrap';

import styles from './TableComponent.module.scss';

export interface TableColumn {
  key: string;
  title: string;
  align?: 'start' | 'center' | 'end';
  verticalAlign?: 'baseline' | 'top' | 'middle' | 'bottom';
  mobileRow?: [row: number, col: number];
}

export interface TableProps {
  columns: TableColumn[];
  data: { [key: string]: string | number | React.ReactNode; className?: string }[];
  title?: string;
  header?: React.ReactNode;
  className?: string;
  customMobileDesign?: React.ReactNode;
  keepTableForMobile?: boolean;
}

export const TableComponent: React.FC<TableProps> = ({
  columns,
  data,
  title,
  header,
  className,
  customMobileDesign,
  keepTableForMobile = false,
}) => {
  const mobileRows: TableColumn[][] = columns.reduce((acc, column, index) => {
    const [row, col] = column.mobileRow || [null, null];
    const rowIndex = row || (index % 2 ? index - 1 : index);
    acc[rowIndex] = acc[rowIndex] || [];
    if (col !== null) {
      acc[rowIndex][col] = column;
    } else {
      acc[rowIndex].push(column);
    }

    return acc;
  }, [] as TableColumn[][]);

  return (
    <Card className={`bg-transparent border-0 rounded-0 mb-4 overflow-hidden ${className || ''}`}>
      {(title || header) && (
        <Card.Header
          className={`bg-transparent border-bottom py-3 px-0 px-md-4 text-dark ${styles.tableHeader}`}
        >
          {title}
          {header}
        </Card.Header>
      )}
      <Card.Body className="p-0">
        <div className={keepTableForMobile ? '' : 'd-none d-lg-block'}>
          <BootstrapTable responsive hover className="m-0">
            <thead>
              <tr className={styles.thead}>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`py-3 px-4 bg-transparent text-nowrap ${column.align ? `text-${column.align}` : ''}`}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {data.map((record, index) => (
                <tr key={index} className={record.className}>
                  {columns.map((column) => (
                    <td
                      key={`${index}-${column.key}`}
                      className={`py-3 px-4 bg-transparent ${column.align ? `text-${column.align}` : ''} ${column.verticalAlign ? `align-${column.verticalAlign}` : ''}`}
                    >
                      {Array.isArray(record[column.key])
                        ? JSON.stringify(record[column.key])
                        : record[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </BootstrapTable>
        </div>

        <div className={keepTableForMobile ? 'd-none' : 'd-block d-lg-none'}>
          {customMobileDesign
            ? customMobileDesign
            : data.map((record, recordIndex) => (
              <div
                key={recordIndex}
                className={`py-3 px-0 border-bottom d-flex flex-wrap gap-2 ${styles.mobileRow} ${record.className}`}
              >
                {mobileRows.map((columns, columnIndex) => (
                  <div
                    key={columnIndex}
                    className={`d-flex gap-2 justify-content-between flex-wrap w-100`}
                  >
                    {columns.map((column, index) => (
                      <div
                        key={`mobile-${index}-${column.key}`}
                        className={`d-flex flex-column flex-grow-1 ${styles.mobileItem} ${index % 2 ? 'text-end' : ''}`}
                      >
                        <div className={styles.mobileLabel}>{column.title}</div>
                        <div className={`${styles.mobileValue} flex-grow-1 text-break`}>
                          {Array.isArray(record[column.key])
                            ? JSON.stringify(record[column.key])
                            : record[column.key]}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
        </div>
      </Card.Body>
    </Card>
  );
};
