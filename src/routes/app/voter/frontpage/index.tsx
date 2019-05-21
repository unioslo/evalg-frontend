import gql from 'graphql-tag';
import React from 'react';
import { Query, WithApolloClient, withApollo } from 'react-apollo';

import { withTranslation, WithTranslation, Trans } from 'react-i18next';

import { Page, PageSection } from 'components/page';
import Loading from 'components/loading';
import { ElectionGroup, IVoter } from 'interfaces';
import { ElectionGroupFields, ElectionFields } from 'fragments';
import { getSignedInPersonIdQuery } from 'queries';
import { electionGroupWithOrderedElections } from 'utils/processGraphQLData';

import VoterElections from './components/VoterElections';

const electionGroupsQuery = gql`
  ${ElectionGroupFields}
  ${ElectionFields}
  query electionGroups {
    electionGroups {
      ...ElectionGroupFields
      elections {
        ...ElectionFields
        electionGroup {
          id
        }
      }
    }
  }
`;

const votersForPersonQuery = gql`
  query votersForPerson($id: UUID!) {
    votersForPerson(id: $id) {
      verified
      pollbook {
        id
        election {
          id
          name
          electionGroup {
            id
          }
        }
      }
    }
  }
`;

interface IProps extends WithTranslation {}

class VoterFrontPage extends React.Component<WithApolloClient<IProps>> {
  render() {
    const { t } = this.props;
    return (
      <Query query={electionGroupsQuery} fetchPolicy="network-only">
        {electionGroupResult => {
          if (electionGroupResult.loading || electionGroupResult.error) {
            return (
              <Loading>
                <Trans>election.loading</Trans>
              </Loading>
            );
          }
          return (
            <Query query={getSignedInPersonIdQuery}>
              {signedInPersonResponse => {
                if (
                  signedInPersonResponse.loading ||
                  signedInPersonResponse.error
                ) {
                  return (
                    <Loading>
                      <Trans>person.loading</Trans>
                    </Loading>
                  );
                }
                return (
                  <Query
                    query={votersForPersonQuery}
                    variables={{
                      id: signedInPersonResponse.data.signedInPerson.personId,
                    }}
                    fetchPolicy="network-only"
                  >
                    {votersForPersonResponse => {
                      if (
                        votersForPersonResponse.loading ||
                        votersForPersonResponse.error
                      ) {
                        return (
                          <Loading>
                            <Trans>voter.loading</Trans>
                          </Loading>
                        );
                      }

                      const canVoteIn = votersForPersonResponse.data.votersForPerson.filter(
                        (voter: IVoter) => voter.verified === true
                      );
                      const electionIds = canVoteIn.map(
                        (voter: IVoter) =>
                          voter.pollbook.election.electionGroup.id
                      );

                      return (
                        <Page header={t('general.welcome')}>
                          <PageSection
                            desc={t('general.frontPageDesc')}
                            noBorder
                          >
                            <VoterElections
                              canVoteElectionGroups={electionIds}
                              electionGroups={electionGroupResult.data.electionGroups
                                .map((eg: ElectionGroup) =>
                                  electionGroupWithOrderedElections(eg, {
                                    onlyActiveElections: true,
                                  })
                                )
                                .filter(
                                  (eg: ElectionGroup) => eg.elections.length > 0
                                )}
                            />
                          </PageSection>
                        </Page>
                      );
                    }}
                  </Query>
                );
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}

export default withApollo(withTranslation()(VoterFrontPage));
