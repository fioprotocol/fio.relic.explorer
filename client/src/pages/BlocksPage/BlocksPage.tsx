import React from 'react';

import Container from 'src/components/layout/Container';
import { TableComponent } from 'src/components/layout/TableComponent';
import { DataTile } from 'src/components/common/DataTile';

import { useBlocksPageContext } from './BlocksPageContext';
import { CardComponent } from 'src/components/layout/CardComponent';

const columns = [
  {
    key: 'pk_block_number',
    title: 'Block Number',
  },
  {
    key: 'block_id',
    title: 'Block ID',
  },
  {
    key: 'stamp',
    title: 'Date',
  },
  {
    key: 'producer',
    title: 'Producer',
  },
  {
    key: 'transaction_count',
    title: 'Transactions',
  },
];

const BlocksPage: React.FC = () => {
  const { currentBlock, blocks, currentBlockLoading, blocksLoading } = useBlocksPageContext();

  return (
    <Container className="py-5">
      <h4 className="mb-5">Blocks</h4>
      <DataTile
        title="Current block"
        items={currentBlock}
        columns={3}
        layout="multi-column"
        loading={currentBlockLoading}
      />
      <CardComponent title="All Blocks" className="my-5">
        {blocksLoading ? (
          <div>Loading...</div>
        ) : (
          // todo: fix any
          <TableComponent columns={columns} data={blocks as any} />
        )}
      </CardComponent>
    </Container>
  );
};

export default BlocksPage;
