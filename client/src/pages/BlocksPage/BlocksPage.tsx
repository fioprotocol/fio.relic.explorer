import React from 'react';
import { Link } from 'react-router';
import { Spinner } from 'react-bootstrap';

import Container from 'src/components/layout/Container';
import { TableComponent } from 'src/components/layout/TableComponent';
import CurrentBlock from 'src/components/CurrentBlock/CurrentBlock';
import { CardComponent } from 'src/components/layout/CardComponent';

import { useBlocksPageContext } from './BlocksPageContext';

import { ROUTES } from 'src/constants/routes';

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
  const { blocks, producers } = useBlocksPageContext();

  return (
    <Container className="py-5">
      <h4 className="mb-5">Blocks</h4>
      <CurrentBlock />
      <CardComponent title="All Blocks" className="my-5">
        {blocks.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner color="primary" />
          </div>
        ) : (
          <TableComponent
            columns={columns}
            data={blocks.map((block) => ({
              pk_block_number: (
                <Link to={`${ROUTES.blocks.path}/${block.pk_block_number}`}>
                  {block.pk_block_number.toLocaleString()}
                </Link>
              ),
              block_id: (
                <Link to={`${ROUTES.blocks.path}/${block.pk_block_number}`}>
                  {`${block.block_id.substring(
                    0,
                    6
                  )}...${block.block_id.substring(block.block_id.length - 6)}`}
                </Link>
              ),
              stamp: new Date(block.stamp).toUTCString(),
              producer: (
                <Link to={`${ROUTES.accounts.path}/${block.producer_account_name}`}>
                  {producers.get(block.producer_account_name)?.candidate_name ||
                    block.producer_account_name}
                </Link>
              ),
              transaction_count: block.transaction_count,
            }))}
          />
        )}
      </CardComponent>
    </Container>
  );
};

export default BlocksPage;
