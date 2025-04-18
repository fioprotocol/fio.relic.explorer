import { FC } from 'react';
import { Link } from 'react-router';
import { LinkItem } from '../../types';

type ProducerLinksProps = {
  links?: LinkItem[];
};

export const ProducerLinks: FC<ProducerLinksProps> = ({ links }) => {
  if (!links || links.length === 0) return null;

  return (
    <div className="d-flex gap-2">
      {links.map((link) => (
        <div key={link.url} className="text-center">
          <Link to={link.url} target="_blank" className="d-inline-block">
            <img 
              src={link.logo} 
              alt={link.name} 
              className="icon-24"
            />
          </Link>
        </div>
      ))}
    </div>
  );
};
