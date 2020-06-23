import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

import { Page } from 'components/page';
import { ElectionGroup, IVoter } from 'interfaces';

import ElectionStatusSection from './components/ElectionStatusSection';
import VotesSection from './components/VotesSection';
import ElectionKeySection from './components/ElectionKeySection';
import CountingSection from './components/CountingSection';
import SurplusVotesSection from './components/SurplusVotesSection';
import { Query } from 'react-apollo';
import {
  searchVotersQuery,
  selfAddedVotersQuery,
  personsWithMultipleVerifiedVotersQuery,
} from 'queries';

interface IProps extends WithTranslation {
  electionGroup: ElectionGroup;
  refetchElectionGroupFunction: () => Promise<any>;
}

interface CategorizedVoters {
  notReviewedVoters: IVoter[];
  verifiedVoters: IVoter[];
  rejectedVoters: IVoter[];
}

const StatusPage: React.FunctionComponent<IProps> = ({
  electionGroup,
  refetchElectionGroupFunction,
  t,
}) => {
  const scrollToStatusRef = React.useRef<HTMLDivElement>(null);
  const getCategorizedVoters = (selfAddedVoters: any) => {
    if (selfAddedVoters.error || selfAddedVoters.loading) {
      return {};
    }

    const electionGroupData = selfAddedVoters.data
      .electionGroup as ElectionGroup;

    const categorizedVoters: CategorizedVoters = {
      notReviewedVoters: [],
      verifiedVoters: [],
      rejectedVoters: [],
    };

    electionGroupData.elections
      .filter(e => e.active)
      .forEach(election => {
        election.pollbooks.forEach(pollbook => {
          pollbook.selfAddedVoters.forEach(selfAddedVoter => {
            switch (selfAddedVoter.verifiedStatus) {
              case 'SELF_ADDED_NOT_REVIEWED':
                categorizedVoters.notReviewedVoters.push(selfAddedVoter);
                break;
              case 'SELF_ADDED_VERIFIED':
                categorizedVoters.verifiedVoters.push(selfAddedVoter);
                break;
              case 'SELF_ADDED_REJECTED':
                categorizedVoters.rejectedVoters.push(selfAddedVoter);
                break;
            }
          });
        });
      });

    return categorizedVoters;
  };

  const showElectionKeySectionAtBottom =
    electionGroup.status === 'ongoing' ||
    electionGroup.status === 'closed' ||
    electionGroup.status === 'multipleStatuses';

  return (
    <>
      <Page header={t('election.electionStatus')}>
        <div ref={scrollToStatusRef} />
        <ElectionStatusSection electionGroup={electionGroup} />
        {!showElectionKeySectionAtBottom && (
          <ElectionKeySection
            electionGroup={electionGroup}
            refetchElectionGroupFunction={refetchElectionGroupFunction}
          />
        )}
        <Query
          query={selfAddedVotersQuery}
          variables={{ id: electionGroup.id }}
          fetchPolicy="network-only"
        >
          {(selfAddedVoters: any) => {
            const categorizedVoters = getCategorizedVoters(selfAddedVoters);
            return (
              <Query
                query={searchVotersQuery}
                variables={{
                  electionGroupId: electionGroup.id,
                  selfAdded: false,
                  reviewed: true,
                  verified: false,
                }}
                fetchPolicy="network-only"
              >
                {(adminAddedRejectedVoters: any) => {
                  return (
                    <Query
                      query={personsWithMultipleVerifiedVotersQuery}
                      variables={{ id: electionGroup.id }}
                      fetchPolicy="network-only"
                    >
                      {(personsWithMultipleVerifiedVoters: any) => {
                        return (
                          <>
                            <VotesSection
                              electionGroup={electionGroup}
                              categorizedVoters={categorizedVoters}
                              adminAddedRejectedVoters={
                                adminAddedRejectedVoters
                              }
                              selfAddedVoters={selfAddedVoters}
                            />
                            <SurplusVotesSection
                              electionGroup={electionGroup}
                              personsWithMultipleVerifiedVoters={
                                personsWithMultipleVerifiedVoters
                              }
                            />
                            <CountingSection
                              selfAddedVoters={selfAddedVoters}
                              categorizedVoters={categorizedVoters}
                              personsWithMultipleVerifiedVoters={
                                personsWithMultipleVerifiedVoters
                              }
                              electionGroup={electionGroup}
                              scrollToStatusRef={scrollToStatusRef}
                            />
                          </>
                        );
                      }}
                    </Query>
                  );
                }}
              </Query>
            );
          }}
        </Query>
        {showElectionKeySectionAtBottom && (
          <ElectionKeySection
            electionGroup={electionGroup}
            refetchElectionGroupFunction={refetchElectionGroupFunction}
          />
        )}
      </Page>
    </>
  );
};

export default withTranslation()(StatusPage);
