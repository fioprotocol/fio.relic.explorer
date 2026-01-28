import { FC } from 'react';

import { JsonSyntaxHighlighter } from 'src/components/common/JsonSyntaxHighlighter/JsonSyntaxHighlighter';
import { Loader } from 'src/components/common/Loader';

import { useKeyPermissionTabContext } from './KeyPermissionTabContext';
import { Alert } from 'src/components/common/Alert';

export const KeyPermissionTab: FC = () => {
  const { keyPermissionsData, loading, error } = useKeyPermissionTabContext();

  if (loading && !error) {
    return <Loader />;
  }

  if (error) {
    return (
      <Alert
        variant="danger"
        title="Error"
        message={typeof error === 'string' ? error : error?.message}
      />
    );
  }

  if (!keyPermissionsData) {
    return <div className="text-center py-5">No permission data available</div>;
  }

  return (
    <div className="p-3">
      <JsonSyntaxHighlighter json={{ permissions: keyPermissionsData.permissions }} />
    </div>
  );
};
