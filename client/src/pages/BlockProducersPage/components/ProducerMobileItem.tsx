import { FC } from 'react';
import { GradeBadge } from 'src/components/common/GradeBadge/GradeBadge';
import { BlockProducerProps } from '../types';
import { ProducerInfo } from './ProducerInfo/ProducerInfo';
import { ProducerLinks } from './ProducerLinks/ProducerLinks';
import { LocationFlag } from './LocationFlag/LocationFlag';
import { ProducerRankBadge } from './ProducerRankBadge/ProducerRankBadge';

type ProducerMobileItemProps = {
  producer: BlockProducerProps;
  index: number;
};

export const ProducerMobileItem: FC<ProducerMobileItemProps> = ({ producer, index }) => {
  const { account, name, logo, votes, fioHandle, links, flagIconUrl, grade } = producer;

  return (
    <div className="border-bottom border-1 py-3 d-flex flex-column gap-3">
      <ProducerInfo name={name} logo={logo} />
      <div className="d-flex flex-row flex-wrap justify-content-between gap-3">
        <div className="d-flex flex-row gap-1">
          <div className="text-secondary f-size-sm">Account:</div>
          <div className="text-dark f-size-sm">{account}</div>
        </div>
        <div className="d-flex flex-row gap-1">
          <div className="text-secondary f-size-sm">FIO Handle:</div>
          <div className="text-dark f-size-sm text-wrap">{fioHandle}</div>
        </div>
      </div> 
      <div className="d-flex flex-row flex-wrap gap-1">
        <div className="text-secondary f-size-sm">Votes:</div>
        <div className="text-dark f-size-sm text-wrap">
          {new Intl.NumberFormat('en-US').format(Number(votes))}
        </div>
      </div>
      <div className="d-flex flex-row flex-wrap justify-content-between gap-3">
        <ProducerLinks links={links} />
        <LocationFlag flagIconUrl={flagIconUrl} name={name} />
        <div className="d-flex flex-row gap-2">
          <GradeBadge grade={grade} />
          <ProducerRankBadge index={index} />
        </div>
      </div>
    </div>
  );
};
