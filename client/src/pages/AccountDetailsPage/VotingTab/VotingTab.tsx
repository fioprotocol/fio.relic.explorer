import { FC, JSX, useState } from 'react';
import { Link } from 'react-router';
import BigNumber from 'big.js';

import { FIO_PREFIX } from '@shared/constants/fio';
import { FioChainVoter } from '@shared/types/fio-api-server';

import { Loader } from 'src/components/common/Loader';
import { Badge } from 'src/components/common/Badge';
import { Alert } from 'src/components/common/Alert';
import { LoadMoreButton } from 'src/components/common/LoadMoreButton/LoadMoreButton';
import { GradeBadge } from 'src/components/common/GradeBadge/GradeBadge';

import { LocationFlag } from 'src/pages/BlockProducersPage/components/LocationFlag/LocationFlag';
import { ProducerLinks } from 'src/pages/BlockProducersPage/components/ProducerLinks/ProducerLinks';
import { ProducerRankBadge } from 'src/pages/BlockProducersPage/components/ProducerRankBadge/ProducerRankBadge';
import { BlockProducerProps } from 'src/pages/BlockProducersPage/types';

import { FIO_DAPP_LINK } from 'src/constants/links';
import { ROUTES } from 'src/constants/routes';
import { formatFioAmount } from 'src/utils/fio';
import { Proxy } from 'src/services/bpmonitor';

import { useVotingTabContext } from './VotingTabContext';

import noPhotoIconSrc from 'src/assets/no-photo.svg';
import styles from './VotingTab.module.scss';

const SECTION_TITLE_CLASS = 'f-size-sm text-dark fw-semibold-inter m-0';
const DELEGATORS_PER_PAGE = 100;

type VotingTabProps = {
  publicKey: string | undefined;
  votes: FioChainVoter[];
  votingProxy: string | null;
  proxy: Proxy | null;
  producers: BlockProducerProps[];
};

const NotVotingTokens = (): JSX.Element => (
  <Alert
    title="Not Voting Tokens"
    variant="danger"
    message={
      <span>
        Not voting the tokens in this wallet.{' '}
        <a
          href={`${FIO_DAPP_LINK}/governance/block-producers`}
          target="_blank"
          rel="noreferrer"
          className="text-decoration-underline text-white"
        >
          Sign in or create a FIO App account to vote tokens
        </a>
      </span>
    }
  />
);

const SectionTitle = ({
  title,
  className = '',
}: {
  title: string;
  className?: string;
}): JSX.Element => <h4 className={`${SECTION_TITLE_CLASS} ${className}`}>{title}</h4>;

export const VotingTab: FC<VotingTabProps> = ({
  publicKey,
  votingProxy,
  votes,
  producers,
  proxy,
}) => {
  const { currentBoardVotingPower, boardMembers, lastBoardVote, loading } = useVotingTabContext({
    publicKey,
    votingProxy,
  });

  const [displayedDelegatorsCount, setDisplayedDelegatorsCount] = useState(DELEGATORS_PER_PAGE);

  const handleLoadMore = (): void => {
    setDisplayedDelegatorsCount((prevCount) => prevCount + DELEGATORS_PER_PAGE);
  };

  if (loading) {
    return <Loader />;
  }

  // Calculate total voting power from all votes
  const totalVotingPower = formatFioAmount({
    amount:
      votes?.reduce((acc, vote) => new BigNumber(acc).add(vote.last_vote_weight).toString(), '0') ||
      '0',
    hasFullAmount: true,
  });

  return (
    <div className="d-flex flex-column gap-3">
      {/* Board of Directors Section */}
      <SectionTitle title="FIO Foundation Board of Directors" />
      <div className="d-flex flex-row flex-wrap f-size-xsm gap-3">
        <div key="board-voting-power" className="d-flex flex-row flex-wrap gap-2">
          <p key="bvp-label" className="text-secondary m-0">
            Current Board Voting Power:
          </p>
          <p key="bvp-value" className="fw-semibold-inter m-0">
            {currentBoardVotingPower || 'N/A'}
          </p>
        </div>
        <div key="last-board-vote" className="d-flex flex-row flex-wrap gap-2">
          <p key="lbv-label" className="text-secondary m-0">
            Last Board Vote:
          </p>
          <p key="lbv-value" className="fw-semibold-inter m-0">
            {lastBoardVote}
          </p>
        </div>
      </div>

      <SectionTitle title="Board Member Votes" className="border-bottom border-1 pb-3" />

      {/* Proxy Alert Section */}
      {votingProxy && (
        <div key="proxy-alert-section">
          <Alert
            title="Proxied"
            message={
              <span>
                Tokens for this wallet are proxied. They count towards the proxy's vote. To stop
                proxying,{' '}
                <a
                  href={`${FIO_DAPP_LINK}/governance/block-producers`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-decoration-underline text-white"
                >
                  vote for block producers by signing in or creating a FIO App account
                </a>
              </span>
            }
          />
          <p className="f-size-sm fw-semibold-inter mt-3">
            This account is proxying votes to{' '}
            <Link to={`${ROUTES.accounts.path}/${votingProxy}`}>{votingProxy}</Link>
          </p>
        </div>
      )}

      {/* Board Members Grid */}
      {boardMembers?.length ? (
        <div className={styles.gridLayout}>
          {boardMembers.map((member) => (
            <div
              key={`board-member-${member.id}`}
              className="d-flex flex-row align-items-center gap-3 p-3"
            >
              <img
                className={`${styles.image} ${member.image ? '' : styles.noImage}`}
                src={member.image || noPhotoIconSrc}
                alt={member.name}
              />
              <div className="d-flex flex-column gap-2">
                <p className="f-size-lsm m-0 fw-semibold-proxima">{member.name}</p>
                <div className="d-flex flex-row align-items-center m-0 gap-2">
                  <Badge
                    key={`status-${member.id}`}
                    variant="primary"
                    className="f-size-xxs text-white fw-semibold-inter"
                  >
                    {member.status}
                  </Badge>
                  <Badge
                    key={`candidate-${member.id}`}
                    variant="white"
                    className={`f-size-xxs fw-semibold-inter ${styles.candidateBadge}`}
                  >
                    Candidate: {member.id}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div key="no-board-members">
          <NotVotingTokens />
        </div>
      )}

      {/* Block Producers Section */}
      <SectionTitle title="Block Producers" />
      <div className="d-flex flex-row flex-wrap gap-2 f-size-xsm">
        <p key="vp-label" className="text-secondary m-0">
          Current Voting Power:{' '}
        </p>
        <p key="vp-value" className="fw-semibold-inter m-0">
          {totalVotingPower}
        </p>
      </div>

      <SectionTitle
        title="Block Producer Votes"
        className="f-size-xsm border-bottom border-1 pb-3"
      />

      {/* Producers Grid */}
      {producers.length ? (
        <div className={styles.gridLayout}>
          {producers.map((producer, index) => (
            <div
              key={`producer-${producer.account}-${index}`}
              className="d-flex flex-column gap-3 p-3"
            >
              <div className="d-flex flex-row align-items-center gap-3">
                <img src={producer.logo} alt={producer.account} className={styles.producerImage} />
                <div className="d-flex flex-column">
                  <p className="f-size-sm m-0 fw-semibold-inter">{producer.account}</p>
                  <p className="f-size-sm m-0">{producer.fioHandle}</p>
                </div>
              </div>
              <div className="d-flex flex-row flex-wrap align-items-center justify-content-between gap-3">
                {producer.flagIconUrl && (
                  <LocationFlag
                    key={`flag-${producer.account}-${index}`}
                    flagIconUrl={producer.flagIconUrl}
                    name={producer.name}
                  />
                )}
                {producer.links && producer.links.length > 0 && (
                  <ProducerLinks
                    key={`links-${producer.account}-${index}`}
                    links={producer.links}
                    imageClassName={styles.producerLinkImage}
                  />
                )}
                <div className="d-flex flex-row align-items-center gap-3">
                  {producer.grade && (
                    <GradeBadge
                      key={`grade-${producer.account}-${index}`}
                      grade={producer.grade}
                      className={styles.gradeBadge}
                    />
                  )}
                  {producer.index !== undefined && (
                    <ProducerRankBadge
                      key={`rank-${producer.account}-${index}`}
                      index={producer.index}
                      className={styles.producerRankBadge}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div key="no-producers">
          <NotVotingTokens />
        </div>
      )}

      {/* Proxy Section */}
      {proxy && (
        <div key="proxy-section" className="d-flex flex-column gap-3">
          <SectionTitle title="Proxy" />
          <SectionTitle title="Votes proxied to this account" className="f-size-xsm" />

          {proxy.delegators.length ? (
            <div key="delegators-container">
              <div className={styles.gridLayout}>
                {proxy.delegators.slice(0, displayedDelegatorsCount).map((delegator, index) => (
                  <Badge
                    variant="white"
                    key={`delegator-${delegator.owner}-${index}`}
                    className={`d-flex flex-row align-items-center justify-content-between gap-2 rounded-3 ${styles.delegatorBadge}`}
                  >
                    <Link to={`${ROUTES.accounts.path}/${delegator.owner}`}>{delegator.owner}</Link>
                    <p className="m-0">
                      {delegator.weight?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 20,
                      })}{' '}
                      {FIO_PREFIX}
                    </p>
                  </Badge>
                ))}
              </div>
              {proxy.delegators.length > displayedDelegatorsCount && (
                <div className="d-flex justify-content-center mt-3">
                  <LoadMoreButton loadMore={handleLoadMore} />
                </div>
              )}
            </div>
          ) : (
            <div key="no-delegators">
              <Alert
                title="No Proxy votes"
                message="This account is not proxying votes to any other accounts"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
