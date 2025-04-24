import React from 'react';
import { Link } from 'react-router';
import { Tab, Tabs } from 'react-bootstrap';

import Container from 'src/components/layout/Container';
import { CardComponent } from 'src/components/layout/CardComponent';
import { BackButton } from 'src/components/common/BackButton';
import { Badge } from 'src/components/common/Badge';
import { Loader } from 'src/components/common/Loader';
import { Alert } from 'src/components/common/Alert';
import Transactions from './Transactions';
import RegisteredHandles from './RegisteredHandles';

import { useDomainDetailsContext } from './DomainDetailsContext';

import { formatDate } from 'src/utils/general';

import { ROUTES } from 'src/constants/routes';

const DomainDetailsPage: React.FC = () => {
  const { domainParam, domain, chainData, loading, error, onBack } = useDomainDetailsContext();

  if (error) {
    return (
      <Container className="py-5">
        <BackButton to={ROUTES.domains.path} />
        <Alert variant="danger" title="Not found">
          Domain <span className="fw-bold">{domainParam}</span> is not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <BackButton onClick={onBack} />
      <h4>FIO Domain: {domain?.domain_name || domainParam}</h4>
      {!domain?.domain_name || loading ? (
        <Loader fullScreen noBg />
      ) : (
        <>
          <div className="d-flex justify-content-end align-items-start align-items-md-center flex-wrap flex-column flex-md-row mb-4 gap-2 gap-md-5 f-size-sm lh-1">
            <div className="text-secondary d-flex justify-content-between align-items-center flex-wrap gap-1 mb-0">
              <span className="me-2">Expiration Date:</span>
              <span className="text-dark fw-bold">
                {domain?.expiration_timestamp ? formatDate(domain?.expiration_timestamp) : 'N/A'}
              </span>
            </div>
            <div className="text-secondary d-flex justify-content-between align-items-center mb-0">
              <span className="me-2">Account:</span>
              <span className="text-dark fw-bold">
                {chainData?.owner_account || domain?.owner_account_name ? (
                  <Link to={`${ROUTES.accounts.path}/${chainData?.owner_account || domain?.owner_account_name}`}>
                    {chainData?.owner_account || domain?.owner_account_name}
                  </Link>
                ) : (
                  '-'
                )}
              </span>
            </div>
            {domain.domain_status === 'active' ? (
              <div className="text-secondary d-flex justify-content-between align-items-center mb-0">
                <span className="me-2">Public:</span>
                <span className="text-dark fw-bold">{domain?.is_public ? 'Yes' : 'No'}</span>
              </div>
            ) : null}
            <div className="text-secondary d-flex justify-content-between align-items-center mb-0">
              <span className="me-2">Status:</span>
              <span className="text-dark fw-bold">
                <Badge
                  variant={domain.domain_status === 'active' ? 'success' : 'warning'}
                  className="text-uppercase"
                >
                  {domain?.domain_status}
                </Badge>
              </span>
            </div>
          </div>

          <CardComponent title="Domain Details">
            <Tabs
              defaultActiveKey="transactions"
              id="block-details-tabs"
              variant="underline"
              className="mb-3"
            >
              <Tab eventKey="transactions" title="Transactions">
                <Transactions domain={domain?.domain_name} />
              </Tab>
              {domain?.domain_status === 'active' ? (
                <Tab eventKey="registered-handles" title="Registered Handles">
                  <RegisteredHandles domain={domain?.domain_name} />
                </Tab>
              ) : null}
            </Tabs>
          </CardComponent>
        </>
      )}
    </Container>
  );
};

export default DomainDetailsPage;
