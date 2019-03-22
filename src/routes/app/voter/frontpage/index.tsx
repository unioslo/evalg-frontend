import gql from 'graphql-tag';
import * as React from 'react';
import { Query, WithApolloClient, withApollo } from 'react-apollo';

import { Page, PageSection } from '../../../../components/page';
import VoterElections from './components/VoterElections';
import { electionGroupWithOrderedElections } from '../../../../utils/processGraphQLData';
import {
  ElectionGroup,
  ViewerResponse,
  VotersForPersonResponse,
  QueryResponse,
} from '../../../../interfaces';
import { getSignedInPersonId } from '../../../../common-queries';
import { WithTranslation } from 'react-i18next';
import { withTranslation } from 'react-i18next';

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
  personId: string;
  canVoteElectionGroups: string[] | null;
}

class VoterFrontPage extends React.Component<WithApolloClient<IProps>, IState> {
  constructor(props: WithApolloClient<IProps>) {
    super(props);

    this.state = {
      personId: '',
      canVoteElectionGroups: null,
    };
  }

  componentDidMount() {
    this.getPersonElections();
  }

  async getPersonElections() {
    const handleSuccess = (p: QueryResponse<ViewerResponse>) => {
      this.setState({ personId: p.data.signedInPerson.personId });
    };
    const handleFailure = (error: any) => {
      this.setState({ canVoteElectionGroups: [] });
      return;
    };
    await getSignedInPersonId(this.props.client, handleSuccess, handleFailure);

    try {
      const elections = await this.props.client.query<VotersForPersonResponse>({
        query: votersForPersonQuery,
        variables: { id: this.state.personId },
      });
      if (elections.data.votersForPerson === null) {
        this.setState({ canVoteElectionGroups: [] });
      } else {
        this.setState({
          canVoteElectionGroups: elections.data.votersForPerson.map(
            voter => voter.pollbook.election.electionGroup.id
          ),
        });
      }
    } catch (err) {
      this.setState({ canVoteElectionGroups: [] });
    }
  }

  render() {
    const { t } = this.props;
    return (
      <Query query={electionGroupsQuery}>
        {({ data, loading, error }) => {
          if (loading || error || this.state.canVoteElectionGroups === null) {
            return null;
          }
          return (
            <Page header={t('general.welcome')}>
              <PageSection desc={t('general.frontPageDesc')} noBorder>
                <VoterElections
                  canVoteElectionGroups={this.state.canVoteElectionGroups}
                  electionGroups={data.electionGroups
                    .map((eg: ElectionGroup) =>
                      electionGroupWithOrderedElections(eg, {
                        onlyActiveElections: true,
                      })
                    )
                    .filter((eg: ElectionGroup) => eg.elections.length > 0)}
                />
              </PageSection>
            </Page>
          );
        }}
      </Query>
    );
  }
}

export default withApollo(withTranslation()(VoterFrontPage));
