import { useParams } from 'react-router';

import { useGetData } from 'src/hooks/useGetData';
import { getAccountKeyPermissions, FioAccountResponse } from 'src/services/fio';

type UseKeyPermissionTabContext = {
  keyPermissionsData: FioAccountResponse | null;
  loading: boolean;
};

export const useKeyPermissionTabContext = (): UseKeyPermissionTabContext => {
  const { id: account } = useParams<{ id: string }>();

  const { response: keyPermissionsData, loading } = useGetData<FioAccountResponse>({
    action: getAccountKeyPermissions,
    params: {
      accountName: account,
    },
  });

  return {
    keyPermissionsData: keyPermissionsData || null,
    loading,
  };
}; 
