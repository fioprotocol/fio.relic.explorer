import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FioLogo } from '../../common/FioLogo';
import SocialLinks from './SocialLinks';
import {
  EXPLORER_LINKS,
  RESOURCE_LINKS,
  EXTERNAL_LINKS,
  LEGAL_LINKS,
} from '../../../constants/links';

import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  const renderLink = (
    item: { to?: string; href?: string; label: string; icon?: string },
    isWhite?: boolean
  ): React.ReactNode => {
    if (item.href) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-${isWhite ? 'white' : 'secondary'} text-decoration-none hover-white`}
        >
          {item.icon ? <i className={`bi bi-${item.icon}`} aria-label={item.label} /> : item.label}
        </a>
      );
    }
    return (
      <Link
        to={item.to || ''}
        className={`text-${isWhite ? 'white' : 'secondary'} text-decoration-none hover-white`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <footer className={`bg-dark py-5 ${styles.footer}`}>
      <Container className="gx-5 gx-xxl-4" fluid="xxl">
        <SocialLinks />

        <Row className="mb-0 mb-lg-4">
          <Col xs={12} md={6} className="mb-4 mb-md-0">
            <div className="mb-3">
              <Link to="/">
                <FioLogo variant="light" height={40} />
              </Link>
            </div>
            <p className="text-white pe-md-5">
              FIO Chain is a fully decentralized public Delegated Proof of Stake (DPoS) blockchain
              that is designed specifically to support the unique usability requirements of the FIO
              Protocol.
            </p>
          </Col>

          <Col xs={12} md={6}>
            <Row className="gy-4">
              <Col xs={6} md={4}>
                <ul className="list-unstyled">
                  {EXPLORER_LINKS.map((item, index) => (
                    <li key={index} className="mb-3">
                      {renderLink(item)}
                    </li>
                  ))}
                </ul>
              </Col>
              <Col xs={6} md={4}>
                <ul className="list-unstyled">
                  {RESOURCE_LINKS.map((item, index) => (
                    <li key={index} className="mb-3">
                      {renderLink(item)}
                    </li>
                  ))}
                </ul>
              </Col>
              <Col xs={6} md={4}>
                <ul className="list-unstyled">
                  {EXTERNAL_LINKS.map((item, index) => (
                    <li key={index} className="mb-3">
                      {renderLink(item)}
                    </li>
                  ))}
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className={`py-4 ${styles.bottomLine}`}>
          <Row className="align-items-center">
            <Col md={12}>
              <ul className="list-inline mb-0 text-md-start">
                {LEGAL_LINKS.map((item, index) => (
                  <li key={index} className="list-inline-item m-0 small">
                    {renderLink(item, true)}
                    <span className="text-white mx-2">|</span>
                  </li>
                ))}
                <li className="list-inline-item m-0 small">
                  <span className="text-white">&copy; 2021 - {new Date().getFullYear()} FIO</span>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
