import { FC } from 'react';

type JsonDataRenderProps = {
  data: string | Record<string, unknown>;
  isPrimaryFirst?: boolean;
};

export const JsonDataRender: FC<JsonDataRenderProps> = ({ data, isPrimaryFirst }) => {
  if (!data) return null;
  // Parse string data if needed
  const parseData = (input: string | Record<string, unknown>): unknown => {
    if (typeof input === 'string') {
      try {
        return JSON.parse(input);
      } catch (e) {
        // Return original string if parsing fails
        return input;
      }
    }
    return input;
  };

  const parsedData = parseData(data);
  const textStyle = 'f-size-sm m-0 p-0';
  const defaultTextStyle = 'text-dark fw-bold';
  const defaultContainerStyle = 'd-flex flex-column gap-1 ms-3';

  // Recursively render any value type
  const renderValue = ({
    value,
    isPrimaryFirst,
    isFirstLayer
  }: {
    value: unknown;
    isPrimaryFirst?: boolean;
    isFirstLayer?: boolean;
  }): React.ReactNode => {
    if (value === null) return <span className={defaultTextStyle}>null</span>;
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className={defaultTextStyle}>[]</span>;
      }
      return (
        <span>
          <span className={defaultTextStyle}>[</span>
          <div className={defaultContainerStyle}>
            {value.map((item, index) => (
              <div key={index} className={textStyle}>
                {renderValue({ value: item })}
              </div>
            ))}
          </div>
          <span className={defaultTextStyle}>]</span>
        </span>
      );
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) {
        return <span className={defaultTextStyle}>{'{}'}</span>;
      }
      return (
        <span>
          {!isFirstLayer && <span className={defaultTextStyle}>{'{'}</span>}
          <div className={defaultContainerStyle}>
            {entries.map(([key, val], index) => (
              <div key={key} className={textStyle}>
                {key}: {renderValue({ value: val, isPrimaryFirst: isPrimaryFirst && index === 0 })}
              </div>
            ))}
          </div>
          {!isFirstLayer && <span className={defaultTextStyle}>{'}'}</span>}
        </span>
      );
    }

    return isFirstLayer
      ? <div className={textStyle}>
        <span className='ms-3'>{String(value)}</span>
      </div>
      : <span className={`${isPrimaryFirst ? 'text-primary' : 'text-dark'} fw-bold text-break`}>
        {String(value)}
      </span>
  };

  return (
    <div className='p-0'>
      {renderValue({ value: parsedData, isPrimaryFirst, isFirstLayer: true })}
    </div>
  );
};
