import React from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import { Link45deg } from 'react-bootstrap-icons';
import { NetworkOption, DEFAULT_NETWORKS, DEFAULT_NETWORK } from '../../../constants/networks';

import styles from './TopBar.module.scss';

interface TopBarProps {
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
      className="border br-2 ps-2 rounded-3 text-decoration-none text-dark d-flex align-items-center btn fw-medium"
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
  networks = DEFAULT_NETWORKS,
  selectedNetwork = DEFAULT_NETWORK,
  onNetworkChange,
}) => {
  const selectedNetworkLabel = networks.find((n) => n.value === selectedNetwork)?.label || networks[0].label;

  return (
    <div className={`py-3 bg-light border-bottom ${styles.wrapper}`}>
      <Container className="d-flex justify-content-between align-items-center">
        <div>
          <div className="me-3">
            FIO Price: <span className="text-primary">$0.04000000</span>
          </div>
          <div className="small text-muted">
            FIO Chain ID:{' '}
            <span className="text-primary">
              2fdcae42c0182200e93f954a07401f19048a7624c6fe81d3c9541a614a88bd1c
            </span>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <Dropdown align="end">
            <Dropdown.Toggle as={CustomToggle}>
              <Link45deg className="text-primary me-2 ms-n1" size={28} />
              {selectedNetworkLabel}
            </Dropdown.Toggle>

            <Dropdown.Menu className="rounded-3 px-4 py-3">
              {networks.map((network) => (
                <Dropdown.Item
                  key={network.value}
                  className={styles.networkItem}
                  active={network.value === selectedNetwork}
                  onClick={() => onNetworkChange(network.value)}
                >
                  {network.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </div>
  );
};

export default TopBar;
