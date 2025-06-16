import { useParams } from 'react-router';

import { useGetData } from 'src/hooks/useGetData';
import { getAccountKeyPermissions, FioAccountResponse } from 'src/services/fio';

type UseKeyPermissionTabContext = {
  error: Error | null | string;
  keyPermissionsData: FioAccountResponse | null;
  loading: boolean;
};

export const useKeyPermissionTabContext = (): UseKeyPermissionTabContext => {
  const { id: account } = useParams<{ id: string }>();

  const {
    response: keyPermissionsData,
    loading,
    error,
  } = useGetData<FioAccountResponse>({
    action: getAccountKeyPermissions,
    params: {
      accountName: account,
    },
  });

  return {
    error,
    keyPermissionsData: keyPermissionsData || null,
    loading,
  };
};
