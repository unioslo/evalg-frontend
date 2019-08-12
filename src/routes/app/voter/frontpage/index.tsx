import gql from 'graphql-tag';
import React from 'react';
import { Query, WithApolloClient, withApollo } from 'react-apollo';

import { withTranslation, WithTranslation, Trans } from 'react-i18next';

import { ErrorPageSection, ErrorInline } from 'components/errors';
import { Page, PageSection } from 'components/page';
import Loading from 'components/loading';
import { ElectionGroup, IVoter } from 'interfaces';
import { ElectionGroupFields, ElectionFields } from 'fragments';
import { getSignedInPersonId } from 'queries';
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
  state = {
    signedInPersonId: '',
    couldNotFetchSignedInPersonIdError: false,
  };

  async componentDidMount() {
    try {
      const signedInPersonId = await getSignedInPersonId(this.props.client);
      this.setState({ signedInPersonId });
    } catch (e) {
      this.setState({ couldNotFetchSignedInPersonIdError: true });
    }
  }

  render() {
    const { t } = this.props;

    if (this.state.couldNotFetchSignedInPersonIdError) {
      return (
        <ErrorInline
          errorMessage={t('voter.voterFrontPage.errors.couldNotFetchPersonId')}
        />
      );
    }

    return (
      <Query query={electionGroupsQuery} fetchPolicy="network-only">
        {({ data: electionGroupData, loading, error }) => {
          if (loading || error) {
            return (
              <Loading>
                <Trans>voter.voterFrontPage.loadingElections</Trans>
              </Loading>
            );
          }
          if (this.state.signedInPersonId === '') {
            return (
              <Loading>
                <Trans>voter.voterFrontPage.loadingUserData</Trans>
              </Loading>
            );
          }

          return (
            <Query
              query={votersForPersonQuery}
              variables={{
                id: this.state.signedInPersonId,
              }}
              fetchPolicy="network-only"
            >
              {({ data: votersForPersonData, loading, error }) => {
                if (loading) {
                  return (
                    <Loading>
                      <Trans>voter.voterFrontPage.loadingUserData</Trans>
                    </Loading>
                  );
                }
                if (error) {
                  return <ErrorPageSection errorMessage={error.message} />;
                }

                const userVerifiedVoters = votersForPersonData.votersForPerson.filter(
                  (voter: IVoter) => voter.verified
                );
                const userVerifiedInElectionGroupIds = userVerifiedVoters.map(
                  (voter: IVoter) => voter.pollbook.election.electionGroup.id
                );

                return (
                  <Page header={t('general.welcome')}>
                    <PageSection desc={t('general.frontPageDesc')} noBorder>
                      <VoterElections
                        votingRightsElectionGroups={
                          userVerifiedInElectionGroupIds
                        }
                        electionGroups={electionGroupData.electionGroups
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
  }
}

export default withApollo(withTranslation()(VoterFrontPage));
