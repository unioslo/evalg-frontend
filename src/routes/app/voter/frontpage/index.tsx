import React from 'react';
import { gql } from '@apollo/client';
import { WithApolloClient, withApollo } from '@apollo/client/react/hoc';
import { Query } from '@apollo/client/react/components';

import { withTranslation, WithTranslation, Trans } from 'react-i18next';

import { ErrorPageSection, ErrorInline } from 'components/errors';
import { Page, PageSection } from 'components/page';
import Loading from 'components/loading';
import { ElectionGroup, IVoter } from 'interfaces';
import { ElectionGroupFields, ElectionFields } from 'fragments';
import { getSignedInPersonId } from 'queries';
import { electionGroupWithOrderedElections } from 'utils/processGraphQLData';

import { MsgBox } from 'components/msgbox';
import { showUserMsg } from 'appConfig';
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

interface IState {
  signedInPersonId: string;
  couldNotFetchSignedInPersonIdError: boolean;
}

class VoterFrontPage extends React.Component<WithApolloClient<IProps>, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      signedInPersonId: '',
      couldNotFetchSignedInPersonIdError: false,
    };
  }

  async componentDidMount() {
    const { client } = this.props;

    if (client) {
      try {
        const signedInPersonId = await getSignedInPersonId(client);
        this.setState({ signedInPersonId });
      } catch (e) {
        this.setState({ couldNotFetchSignedInPersonIdError: true });
      }
    }
  }

  render() {
    const { t } = this.props;
    const { couldNotFetchSignedInPersonIdError, signedInPersonId } = this.state;
    if (couldNotFetchSignedInPersonIdError) {
      return (
        <ErrorInline
          errorMessage={t('voter.voterFrontPage.errors.couldNotFetchPersonId')}
        />
      );
    }

    return (
      <Query query={electionGroupsQuery} fetchPolicy="network-only">
        {(result: any) => {
          const { data: electionGroupData, loading, error } = result;
          if (loading || error) {
            return (
              <Loading>
                <Trans>voter.voterFrontPage.loadingElections</Trans>
              </Loading>
            );
          }
          if (signedInPersonId === '') {
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
                id: signedInPersonId,
              }}
              fetchPolicy="network-only"
            >
              {(resultVotersForPerson: any) => {
                const {
                  data: votersForPersonData,
                  loading: votersForPersonLoading,
                  error: votersForPersonError,
                } = resultVotersForPerson;
                if (votersForPersonLoading) {
                  return (
                    <Loading>
                      <Trans>voter.voterFrontPage.loadingUserData</Trans>
                    </Loading>
                  );
                }
                if (votersForPersonError) {
                  return (
                    <ErrorPageSection
                      errorMessage={votersForPersonError.message}
                    />
                  );
                }

                const userVerifiedVoters =
                  votersForPersonData.votersForPerson.filter(
                    (voter: IVoter) => voter.verified
                  );
                const userVerifiedInElectionGroupIds = userVerifiedVoters.map(
                  (voter: IVoter) => voter.pollbook.election.electionGroup.id
                );

                return (
                  <Page header={t('general.welcome')}>
                    {showUserMsg && (
                      <MsgBox
                        msg={
                          <Trans
                            t={t}
                            components={[
                              <a href="https://valg2.uio.no">text</a>,
                            ]}
                          >
                            loginPage.message
                          </Trans>
                        }
                        timeout={false}
                        warning
                      />
                    )}
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
