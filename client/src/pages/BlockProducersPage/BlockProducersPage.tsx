import { FC } from 'react';

import Container from 'src/components/layout/Container';
import { LoadableTable } from 'src/components/common/LoadableTable';

import { createProducerDesktopRow, ProducerMobileItem } from './components';
import { useBlockProducersPageContext } from './BlockProducersPageContext';

const BlockProducersPage: FC = () => {
  const { columns, loading, producers } = useBlockProducersPageContext();

  return (
    <Container title="Block Producers">
      <p className="f-size-sm">Registered Block Producers: <span className="text-dark fw-bold">{producers?.length}</span></p>
      <LoadableTable
        columns={columns}
        data={producers?.map((producer, index) => createProducerDesktopRow(producer, index))}
        customMobileDesign={producers?.map((producer, index) => (
          <ProducerMobileItem 
            key={producer.account}
            producer={producer} 
            index={index} 
          />
        ))}
        title="All Block Producers"
        showPagination={false}
        loading={loading}
        className="mt-3"
      />
    </Container>
  );
};

export default BlockProducersPage;
