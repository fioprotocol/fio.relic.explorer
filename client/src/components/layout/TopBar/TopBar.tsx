import React from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { Link45deg } from 'react-bootstrap-icons';

import Container from '../Container';
import { TopBarSearch } from '../../../components/Search';

import { useSearch } from '../../../hooks';

import { NetworkOption, DEFAULT_NETWORKS, DEFAULT_NETWORK } from '../../../constants/networks';

import styles from './TopBar.module.scss';

interface TopBarProps {
  price: string;
  chainId: string;
  networks?: NetworkOption[];
  selectedNetwork?: string;
  onNetworkChange: (network: string) => void;
}

const CustomToggle = React.forwardRef(
  (
    {
      children,
      onClick,
    }: { children: React.ReactNode; onClick: (e: React.MouseEvent<HTMLDivElement>) => void },
    ref: React.Ref<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={`border br-2 ps-2 rounded-3 text-decoration-none text-dark d-flex align-items-center btn fw-medium text-white-hover ${styles.dropdownToggle}`}
      onClick={(e): void => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </div>
  )
);

const TopBar: React.FC<TopBarProps> = ({
  price,
  chainId,
  networks = DEFAULT_NETWORKS,
  selectedNetwork = DEFAULT_NETWORK,
  onNetworkChange,
}) => {
  const selectedNetworkLabel =
    networks.find((n) => n.value === selectedNetwork)?.label || networks[0].label;

  const { handleSearch, isSearching } = useSearch();

  return (
    <div className={`py-3 ${styles.wrapper}`}>
      <Container>
        <Row>
          <Col xs={12} lg={6}>
            <div className="me-3">
              FIO Price: <span className="text-primary">{price ? `$${price}` : '-'}</span>
            </div>
            <div className="small text-muted">
              FIO Chain ID: <span className="text-primary text-break">{chainId}</span>
            </div>
          </Col>

          <Col xs={12} lg={6}>
            <div className="d-none d-lg-flex align-items-center justify-content-between gap-4">
              <div className="flex-grow-1">
                <TopBarSearch onSearch={handleSearch} searching={isSearching} />
              </div>
              <Dropdown align="end" className="d-none d-md-flex">
                <Dropdown.Toggle as={CustomToggle}>
                  <Link45deg className="text-primary me-2 ms-n1" size={28} />
                  {selectedNetworkLabel}
                </Dropdown.Toggle>

                <Dropdown.Menu className="rounded-3 px-0 py-3">
                  {networks.map((network) => (
                    <Dropdown.Item
                      key={network.value}
                      className={`px-4 py-0 ${styles.networkItem}`}
                      active={network.value === selectedNetwork}
                      onClick={(): void => onNetworkChange(network.value)}
                    >
                      <div>{network.label}</div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </Container>

      <div className="d-block d-lg-none">
        <TopBarSearch onSearch={handleSearch} withContainer />
      </div>
    </div>
  );
};

export default TopBar;
