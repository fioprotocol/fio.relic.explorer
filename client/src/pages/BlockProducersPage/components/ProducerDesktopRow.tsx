import { Badge } from 'src/components/common/Badge';
import { GradeBadge } from 'src/components/common/GradeBadge/GradeBadge';
import { BlockProducerProps } from '../types';
import { ProducerInfo } from './ProducerInfo/ProducerInfo';
import { ProducerLinks } from './ProducerLinks/ProducerLinks';
import { LocationFlag } from './LocationFlag/LocationFlag';
import { ProducerRankBadge } from './ProducerRankBadge/ProducerRankBadge';

type ProducerDesktopRowProps = {
  name: React.ReactNode;
  votes: React.ReactNode;
  account: React.ReactNode;
  fioHandle: React.ReactNode;
  links: React.ReactNode;
  location: React.ReactNode;
  grade: React.ReactNode;
  ranks: React.ReactNode;
};

export const createProducerDesktopRow = (producer: BlockProducerProps, index: number): ProducerDesktopRowProps => {
  const { account, name, logo, votes, fioHandle, links, flagIconUrl, grade } = producer;
  
  return {
    name: <ProducerInfo name={name} logo={logo} />,
    votes: (
      <Badge variant="white" className="px-2 py-1 f-size-sm">
        {new Intl.NumberFormat('en-US').format(Number(votes))}
      </Badge>
    ),
    account: <div className="text-dark">{account}</div>,
    fioHandle: <div className="text-dark">{fioHandle}</div>,
    links: <ProducerLinks links={links} />,
    location: <LocationFlag flagIconUrl={flagIconUrl} name={name} />,
    grade: <GradeBadge grade={grade} />,
    ranks: <ProducerRankBadge index={index} />,
  };
};
