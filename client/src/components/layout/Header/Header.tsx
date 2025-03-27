import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Wallet2, ChevronDown } from 'react-bootstrap-icons';

import styles from './Header.module.scss';

interface MenuItem {
  title: string;
  path: string;
  items?: { title: string; path: string }[];
}

const menuItems: MenuItem[] = [
  { title: 'Transactions', path: '/transactions' },
  { title: 'Blocks', path: '/blocks' },
  { title: 'FIO Handles', path: '/handles' },
  { title: 'FIO Domains', path: '/domains' },
  { title: 'Accounts', path: '/accounts' },
  {
    title: 'Governance',
    path: '/governance',
    items: [
      { title: 'Producers', path: '/producers' },
      { title: 'Proxies', path: '/proxies' },
    ],
  },
  {
    title: 'Advanced',
    path: '/advanced',
    items: [
      { title: 'Contracts', path: '/contracts' },
      { title: 'Multisigs', path: '/multisigs' },
    ],
  },
];

const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <Navbar bg="white" expand="lg" className="py-2">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img src="/images/logo-dark.png" alt="FIO Logo" className={styles.logoImage} />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center gap-1">
              {menuItems.map((item, index) =>
                item.items ? (
                  <NavDropdown
                    key={index}
                    title={
                      <span className="dropdown-title">
                        {item.title}
                        <ChevronDown size={14} className="ms-2" />
                      </span>
                    }
                    id={`${item.title.toLowerCase()}-dropdown`}
                  >
                    {item.items.map((subItem, subIndex) => (
                      <NavDropdown.Item key={subIndex} as={Link} to={subItem.path}>
                        {subItem.title}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                ) : (
                  <Nav.Link key={index} as={Link} to={item.path}>
                    {item.title}
                  </Nav.Link>
                )
              )}

              <div className="nav-divider mx-3"></div>

              <Nav.Link
                as={Link}
                to="/launch"
                className="launch"
              >
                <Wallet2 size={18} className="me-3" />
                Launch FIO App
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
