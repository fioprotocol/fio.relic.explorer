import React from 'react';
import { Spinner } from 'react-bootstrap';

import CurrentBlock from './CurrentBlock';

import { useCurrentBlockContext } from './CurrentBlockContext';

const CurrentBlockContainer: React.FC = () => {
  const { currentBlock, producer } = useCurrentBlockContext();

  if (!currentBlock) {
    return (
      <div className="d-flex justify-content-center align-items-center m-4">
        <Spinner color="primary" />
      </div>
    );
  }

  return <CurrentBlock currentBlock={currentBlock} producer={producer} />;
};

export default CurrentBlockContainer;
