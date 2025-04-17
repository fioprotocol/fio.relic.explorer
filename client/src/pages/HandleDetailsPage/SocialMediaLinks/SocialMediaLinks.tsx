import { FC } from 'react';
import { Link } from 'react-router';

import { Alert } from 'src/components/common/Alert';
import { SocialMediaLogo } from 'src/components/SocialLogo';

import { useSocialMediaLinksContext } from './SocialMediaLinksContext';

import { PubAddress } from '@shared/types/pub-address';

import styles from './SocialMediaLinks.module.scss';

export const SocialMediaLinks: FC<{ mappedPubAddresses: PubAddress[] }> = ({
  mappedPubAddresses,
}) => {
  const { links } = useSocialMediaLinksContext({ mappedPubAddresses });

  if (links.length === 0)
    return (
      <Alert
        variant="danger"
        title="No Social Media Links"
        message="There are no social media links associated with this FIO Handle."
      />
    );

  return (
    <div className="d-flex gap-4 flex-wrap">
      {links.map((link) => (
        <Link
          to={link.url}
          key={link.title}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-primary p-3 rounded-3 ${styles.socialMediaLink}`}
        >
          <div className="d-flex align-items-center gap-3 pb-3">
            <SocialMediaLogo socialMediaId={link.id} />
            <p className="mb-0 fw-bold h4 text-truncate text-capitalize">{link.title}</p>
          </div>
          <div className="text-start fw-bold f-size-sm text-truncate">{link.url}</div>
        </Link>
      ))}
    </div>
  );
};

export default SocialMediaLinks;
