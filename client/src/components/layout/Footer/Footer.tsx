import React from 'react';
import { Link } from 'react-router-dom';
import { FioLogo } from '../../common/FioLogo';

import styles from './Footer.module.scss';

const socialLinks = [
  { href: 'https://discord.gg/fio', icon: 'discord', label: 'Discord' },
  { href: 'https://x.com/fioprotocol', icon: 'x', label: 'X (Twitter)' },
  { href: 'https://facebook.com/fioprotocol', icon: 'facebook', label: 'Facebook' },
  { href: 'https://github.com/fioprotocol', icon: 'github', label: 'GitHub' },
  { href: 'https://instagram.com/fioprotocol', icon: 'instagram', label: 'Instagram' },
  { href: 'https://linkedin.com/company/fioprotocol', icon: 'linkedin', label: 'LinkedIn' },
  { href: 'https://medium.com/fioprotocol', icon: 'medium', label: 'Medium' },
  { href: 'https://mastodon.social/@fioprotocol', icon: 'mastodon', label: 'Mastodon' },
];

const explorerLinks = [
  { to: '/transactions', label: 'Transactions' },
  { to: '/blocks', label: 'Blocks' },
  { to: '/handles', label: 'FIO Handles' },
  { to: '/domains', label: 'FIO Domains' },
  { to: '/accounts', label: 'Accounts' },
];

const resourceLinks = [
  { to: '/block-producers', label: 'Block Producers' },
  { to: '/proxies', label: 'Proxies' },
  { to: '/multisigs', label: 'Multisigs' },
  { to: '/contracts', label: 'Contracts' },
];

const externalLinks = [
  { href: 'https://developers.fio.net', label: 'Developer Portal' },
  { href: 'https://fio.net', label: 'FIO Website' },
  { href: 'https://fio.app', label: 'FIO dApp' },
];

const legalLinks = [
  { to: '/support', label: 'Support' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-of-service', label: 'Terms of Service' },
];

const Footer: React.FC = () => {
  const renderLink = (item: { to?: string; href?: string; label: string; icon?: string }) => {
    if (item.href) {
      return (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-secondary">
          {item.icon ? <i className={`bi bi-${item.icon}`} aria-label={item.label} /> : item.label}
        </a>
      );
    }
    return <Link to={item.to || ''} className="text-secondary">{item.label}</Link>;
  };

  return (
    <footer className={`bg-dark py-5 ${styles.footer}`}>
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex gap-3 justify-content-center mb-4">
              {socialLinks.map((item, index) => (
                <div key={index} className={styles.socialIcon}>
                  {renderLink(item)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <div className="mb-3">
              <FioLogo variant="light" height={40} />
            </div>
            <p className="text-secondary">
              FIO Chain is a fully decentralized public Delegated Proof of Stake (DPoS) blockchain that is designed specifically to support the unique usability requirements of the FIO Protocol.
            </p>
          </div>
          
          <div className="col-12 col-md-8">
            <div className="row">
              <div className="col-6 col-md-4">
                <ul className="list-unstyled">
                  {explorerLinks.map((item, index) => (
                    <li key={index} className="mb-2">{renderLink(item)}</li>
                  ))}
                </ul>
              </div>
              <div className="col-6 col-md-4">
                <ul className="list-unstyled">
                  {resourceLinks.map((item, index) => (
                    <li key={index} className="mb-2">{renderLink(item)}</li>
                  ))}
                </ul>
              </div>
              <div className="col-6 col-md-4">
                <ul className="list-unstyled">
                  {externalLinks.map((item, index) => (
                    <li key={index} className="mb-2">{renderLink(item)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-top border-secondary pt-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="text-secondary mb-md-0">&copy; {new Date().getFullYear()} FIO Protocol. All rights reserved.</p>
            </div>
            <div className="col-md-6">
              <ul className="list-inline mb-0 text-md-end">
                {legalLinks.map((item, index) => (
                  <li key={index} className="list-inline-item">
                    {renderLink(item)}
                    {index < legalLinks.length - 1 && <span className="text-secondary mx-2">|</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
