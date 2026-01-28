import { FC, ReactNode, JSX } from 'react';

import styles from './JsonSyntaxHighlighter.module.scss';

type JsonSyntaxHighlighterProps = {
  json: object | string;
};

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

// Reusable component for comma rendering
const Comma = ({ show }: { show: boolean }): JSX.Element | null =>
  show ? <span className={styles.jsonComma}>,</span> : null;

// Reusable wrapper for primitive values
const ValueWrapper = ({
  children,
  isLastItem
}: {
  children: ReactNode;
  isLastItem: boolean;
}): JSX.Element => (
  <span>
    {children}
    <Comma show={!isLastItem} />
  </span>
);

// Component for empty containers ([] or {})
const EmptyContainer = ({
  type,
  isLastItem
}: {
  type: 'array' | 'object';
  isLastItem: boolean;
}): JSX.Element => (
  <ValueWrapper isLastItem={isLastItem}>
    <span className={styles.jsonBrace}>
      {type === 'array' ? '[]' : '{}'}
    </span>
  </ValueWrapper>
);

export const JsonSyntaxHighlighter: FC<JsonSyntaxHighlighterProps> = ({ json }) => {
  const jsonObj = typeof json === 'string' ? JSON.parse(json) : json;
  
  const renderJson = (value: JsonValue, indent = 0, isLastItem = true): ReactNode => {
    const indentStr = '  '.repeat(indent);
    
    if (value === null) {
      return (
        <ValueWrapper isLastItem={isLastItem}>
          <span className={styles.jsonBoolean}>null</span>
        </ValueWrapper>
      );
    }
    
    if (typeof value === 'boolean') {
      return (
        <ValueWrapper isLastItem={isLastItem}>
          <span className={styles.jsonBoolean}>{String(value)}</span>
        </ValueWrapper>
      );
    }
    
    if (typeof value === 'number') {
      return (
        <ValueWrapper isLastItem={isLastItem}>
          <span className={styles.jsonNumber}>{value}</span>
        </ValueWrapper>
      );
    }
    
    if (typeof value === 'string') {
      return (
        <ValueWrapper isLastItem={isLastItem}>
          <span className={styles.jsonString}>"{value}"</span>
        </ValueWrapper>
      );
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <EmptyContainer type="array" isLastItem={isLastItem} />;
      }
      
      return (
        <span>
          <span className={styles.jsonBrace}>[</span>
          <br />
          {value.map((item, index) => (
            <span key={index}>
              {indentStr}  {renderJson(item, indent + 1, index === value.length - 1)}
              <br />
            </span>
          ))}
          {indentStr}<span className={styles.jsonBrace}>]</span>
          <Comma show={!isLastItem} />
        </span>
      );
    }
    
    // Object
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return <EmptyContainer type="object" isLastItem={isLastItem} />;
    }
    
    return (
      <span>
        <span className={styles.jsonBrace}>{"{"}</span>
        <br />
        {entries.map(([key, val], index) => (
          <span key={key}>
            {indentStr}  <span className={styles.jsonKey}>"{key}"</span>: {renderJson(val, indent + 1, index === entries.length - 1)}
            <br />
          </span>
        ))}
        {indentStr}<span className={styles.jsonBrace}>{"}"}</span>
        <Comma show={!isLastItem} />
      </span>
    );
  };

  return (
    <pre className={`p-0 m-0 ${styles.jsonHighlighter}`}>
      {renderJson(jsonObj)}
    </pre>
  );
};
