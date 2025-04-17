import React from 'react';
import { Link } from 'react-router';
import { Tab, Tabs } from 'react-bootstrap';

import Container from 'src/components/layout/Container';
import { CardComponent } from 'src/components/layout/CardComponent';
import { BackButton } from 'src/components/common/BackButton';
import { Badge } from 'src/components/common/Badge';
import { Loader } from 'src/components/common/Loader';
import { Transactions } from './Transactions/Transactions';
import MappedPubAddresses from './MappedPubAddresses/MappedPubAddresses';
import SignedNFTs from './SignedNFTs';
import SocialMediaLinks from './SocialMediaLinks/SocialMediaLinks';

import { useHandleDetailsContext } from './HandleDetailsContext';

import { formatDate } from 'src/utils/general';

import { ROUTES } from 'src/constants/routes';

const HandleDetailsPage: React.FC = () => {
  const { handleParam, handle, chainData, loading } = useHandleDetailsContext();

  return (
    <Container className="py-5">
      <BackButton to={ROUTES.handles.path} />
      <h4>FIO Handle: {handle?.handle || handleParam}</h4>
      {!handle?.handle || loading ? (
        <Loader fullScreen noBg />
      ) : (
        <>
          <div className="d-block d-lg-flex justify-content-end align-items-center mb-4 gap-5 f-size-sm lh-1">
            <div className="text-secondary mb-0">
              <span className="me-2">Creation Date:</span>
              <span className="text-dark fw-bold">
                {handle?.block_timestamp ? formatDate(handle?.block_timestamp) : 'N/A'}
              </span>
            </div>
            <div className="text-secondary d-flex justify-content-between align-items-center mb-0">
              <span className="me-2">Account:</span>
              <span className="text-dark fw-bold"> 
                <Link to={`${ROUTES.accounts.path}/${chainData?.owner_account}`}>
                  {handle?.owner_account_name}
                </Link>
              </span>
            </div>
            <div className="text-secondary d-flex justify-content-between align-items-center mb-0">
              <span className="me-2">Domain:</span>
              <span className="text-dark fw-bold">
                <Link to={`${ROUTES.domains.path}/${handle.domain_name}`}>
                  {handle?.domain_name}
                </Link>
              </span>
            </div>
            {handle.handle_status === 'active' ? (
              <div className="text-secondary d-flex justify-content-between align-items-center mb-0">
                <span className="me-2">Remaining Bundles:</span>
                <span className="text-dark fw-bold">{chainData?.bundleeligiblecountdown}</span>
              </div>
            ) : null}
            <div className="text-secondary d-flex justify-content-between align-items-center mb-0">
              <span className="me-2">Status:</span>
              <span className="text-dark fw-bold">
                <Badge
                  variant={handle.handle_status === 'active' ? 'success' : 'warning'}
                  className="text-uppercase"
                >
                  {handle?.handle_status}
                </Badge>
              </span>
            </div>
          </div>

          <CardComponent title="Handle Details">
            <Tabs
              defaultActiveKey="transactions"
              id="block-details-tabs"
              variant="underline"
              className="mb-3"
            >
              <Tab eventKey="transactions" title="Transactions">
                <Transactions handle={handle?.handle} />
              </Tab>
              <Tab eventKey="pub_addresses" title="Mapped Public Addresses">
                <MappedPubAddresses mappedPubAddresses={chainData?.addresses || []} fch={handle?.handle} />
              </Tab>
              <Tab eventKey="nfts" title="Signed NFTs">
                <SignedNFTs handle={handle?.handle} />
              </Tab>
              <Tab eventKey="links" title="Social Media Links">
                <SocialMediaLinks mappedPubAddresses={chainData?.addresses || []} />
              </Tab>
            </Tabs>
          </CardComponent>
        </>
      )}
    </Container>
  );
};

export default HandleDetailsPage;
