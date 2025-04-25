import { useState, useCallback, useEffect } from 'react';

import { useLoadMoreData } from 'src/hooks/useLoadMoreData';
import { getTableInfo } from 'src/services/fio';

import { ContractItemType, ContractTable, ContractTableRow } from '@shared/types/fio-api-server';

export type UseContractsDataTableContextType = {
  loading: boolean;
  activeContract: ContractItemType | null;
  activeTable: ContractTable | null;
  tableRows: ContractTableRow[]; // TODO: fix type
  hasMore: boolean;
  fetched: boolean;
  loadMore: () => void;
};

export const useContractsDataTableContext = ({
  activeTable,
  activeContract,
  reverse,
}: {
  activeTable: ContractTable | null;
  activeContract: ContractItemType | null;
  reverse: boolean;
}): UseContractsDataTableContextType => {
  const [lowerBound, setLowerBound] = useState<{
    current?: number | string;
    next?: number | string;
  }>({});
  const handleLoadMore = useCallback(
    () => setLowerBound((prev) => ({ ...prev, current: prev.next })),
    []
  );
  const fetchId = `${activeContract?.name || ''}_${activeTable?.name || ''}_${reverse ? 'reverse' : ''}`;

  const {
    data: tableRows,
    loading: tableInfoLoading,
    hasMore,
    fetched,
  } = useLoadMoreData<ContractTableRow>({
    fetchId,
    action: getTableInfo,
    params: {
      contractName: activeContract?.name,
      tableName: activeTable?.name,
      ...(reverse ? { upper_bound: lowerBound.current } : { lower_bound: lowerBound.current }),
      reverse,
      // scope: activeTable?.scope, // TODO: there are multiple scopes could be in the contract that can be applied to the getTableInfo
    },
    dataKey: 'rows',
    itemIdKey: 'id', // TODO: check waht else could be used as itemIdKey for different contracts
  });

  useEffect(() => {
    setLowerBound({});
  }, [fetchId]);

  useEffect(() => {
    if (tableRows.length > 0) {
      setLowerBound((prev) => ({
        ...prev,
        next: tableRows[tableRows.length - 1].id,
      }));
    }
  }, [tableRows]);

  return {
    loading: tableInfoLoading,
    activeContract,
    activeTable,
    tableRows,
    hasMore,
    loadMore: handleLoadMore,
    fetched,
  };
};
