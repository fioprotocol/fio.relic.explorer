import React from 'react';

import { Loader } from 'src/components/common/Loader';
import CurrentBlock from './CurrentBlock';

import { useCurrentBlockContext } from './CurrentBlockContext';

const CurrentBlockContainer: React.FC = () => {
  const { currentBlock, producer } = useCurrentBlockContext();

  if (!currentBlock) {
    return <Loader fullScreen noBg className="m-4" />;
  }

  return <CurrentBlock currentBlock={currentBlock} producer={producer} />;
};

export default CurrentBlockContainer;
