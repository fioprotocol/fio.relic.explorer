import { FC } from 'react';

import { JsonSyntaxHighlighter } from 'src/components/common/JsonSyntaxHighlighter/JsonSyntaxHighlighter';
import { Loader } from 'src/components/common/Loader';

import { useKeyPermissionTabContext } from './KeyPermissionTabContext';

export const KeyPermissionTab: FC = () => {
  const { keyPermissionsData, loading } = useKeyPermissionTabContext();

  if (loading) {
    return <Loader />;
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
