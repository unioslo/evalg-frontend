import gql from 'graphql-tag';
import * as React from 'react';
import { Query, WithApolloClient, withApollo } from 'react-apollo';

import { Page, PageSection } from '../../../../components/page';
import VoterElections from './components/VoterElections';
import { electionGroupWithOrderedElections } from '../../../../utils/processGraphQLData';
import { ElectionGroup, VotersForPerson } from '../../../../interfaces';
import { getSignedInPersonIdQuery } from '../../../../common-queries';
import { WithTranslation, Trans } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import Loading from '../../../../components/loading';

const electionGroupsQuery = gql`
  query electionGroups {
    electionGroups {
      id
      name
      description
      type
      candidateType
      mandateType
      meta
      ouId
      publicKey
      announcedAt
      publishedAt
      cancelledAt
      deletedAt
      status
      cancelled
      announced
      published
      deleted
      elections {
        id
        name
        description
        type
        candidateType
        mandateType
        meta
        sequence
        start
        end
        informationUrl
        contact
        mandatePeriodStart
        mandatePeriodEnd
        groupId
        active
        status
        publishedAt
        cancelledAt
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
  constructor(props: WithApolloClient<IProps>) {
    super(props);
  }

  render() {
    const { t } = this.props;
    return (
      <Query query={electionGroupsQuery}>
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
                        (voter: VotersForPerson) => voter.verified === true
                      );
                      const electionIds = canVoteIn.map(
                        (voter: VotersForPerson) =>
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
