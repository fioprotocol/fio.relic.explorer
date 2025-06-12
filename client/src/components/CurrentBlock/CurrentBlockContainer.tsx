import React from 'react';

import CurrentBlock from './CurrentBlock';

import { useCurrentBlockContext } from './CurrentBlockContext';

const CurrentBlockContainer: React.FC = () => {
  const { currentBlock, producer, loading } = useCurrentBlockContext();

  return <CurrentBlock currentBlock={currentBlock} producer={producer} loading={loading} />;
};

export default CurrentBlockContainer;
