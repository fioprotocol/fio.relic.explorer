import { FC } from 'react';

import { useSocialMediaLinksContext } from './SocialMediaLinksContext';

import { PubAddress } from '@shared/types/pub-address';

export const SocialMediaLinks: FC<{ mappedPubAddresses: PubAddress[] }> = ({
  mappedPubAddresses,
}) => {
  const { links } = useSocialMediaLinksContext({ mappedPubAddresses });

  return links.length > 0 ? (
    <div>
      {links.map((link) => (
        <div key={link.title}>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.title}
          </a>
        </div>
      ))}
    </div>
  ) : (
    <span> No social media links</span>
  );
};

export default SocialMediaLinks;
