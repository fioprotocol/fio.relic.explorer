import { useState, useCallback, useEffect } from 'react';

import { useLoadMoreData } from 'src/hooks/useLoadMoreData';
import { getTableInfo } from 'src/services/fio';

import { ContractItemType, ContractTable, ContractTableRow } from '@shared/types/fio-api-server';

export type UseContractsDataTableContextType = {
  loading: boolean;
  activeContract: ContractItemType | null;
  activeTable: ContractTable | null;
  tableRows: ContractTableRow[];
  hasMore: boolean;
  fetched: boolean;
  loadMore: () => void;
};

const ITEM_ID_KEY_MAP = {
  fiofees: 'fee_id',
  feevoters: 'block_producer_name',
  lockedtokens: 'owner',
  topprods: 'producer',
  accountmap: 'account',
};

export const useContractsDataTableContext = ({
  activeTable,
  activeContract,
  activeScope,
  reverse,
}: {
  activeTable: ContractTable | null;
  activeContract: ContractItemType | null;
  activeScope: string | null;
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
  const fetchId = `${activeContract?.name || ''}_${activeTable?.name || ''}_${activeScope || ''}_${reverse ? 'reverse' : ''}`;
  const itemIdKey =
    activeTable?.key_names[0] ||
    ITEM_ID_KEY_MAP[activeTable?.name as keyof typeof ITEM_ID_KEY_MAP] ||
    'id';

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
      scope: activeScope,
    },
    dataKey: 'rows',
    itemIdKey,
  });

  useEffect(() => {
    setLowerBound({});
  }, [fetchId]);

  useEffect(() => {
    if (tableRows.length > 0) {
      setLowerBound((prev) => ({
        ...prev,
        next: tableRows[tableRows.length - 1][itemIdKey],
      }));
    }
  }, [tableRows, itemIdKey]);

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
