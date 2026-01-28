import { FC } from 'react';

import { Alert } from 'src/components/common/Alert';
import { Loader } from 'src/components/common/Loader';
import { TableComponent } from 'src/components/layout/TableComponent';
import { LoadMoreButton } from 'src/components/common/LoadMoreButton';

import { useContractsDataTableContext } from './ContractsDataTableContext';

import { ContractItemType, ContractTable } from '@shared/types/fio-api-server';

const ContractsPage: FC<{
  activeContract: ContractItemType | null;
  activeTable: ContractTable | null;
  activeScope: string | null;
  scopeLoading: boolean;
  reverse: boolean;
}> = ({ activeContract, activeTable, activeScope, scopeLoading, reverse }) => {
  const { loading, tableRows, hasMore, loadMore, fetched } = useContractsDataTableContext({
    activeContract,
    activeTable,
    activeScope,
    reverse,
  });

  if (!activeTable || !activeContract) {
    return null;
  }

  if (!fetched || scopeLoading || !activeScope) {
    return <Loader fullScreen className="my-5" />;
  }

  return (
    <>
      {tableRows.length > 0 ? (
        <TableComponent
          columns={Object.keys(tableRows[0]).map((key) => ({ key, title: key, verticalAlign: 'baseline' }))}
          data={tableRows}
          keepTableForMobile={true}
        />
      ) : (
        <Alert variant="info" title="No data found" className="mt-5" hasDash={false} />
      )}

      {hasMore && (
        <div className="d-flex mt-5 justify-content-center">
          <LoadMoreButton loadMore={loadMore} loading={loading} />
        </div>
      )}
    </>
  );
};

export default ContractsPage;
