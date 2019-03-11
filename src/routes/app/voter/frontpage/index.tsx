import gql from 'graphql-tag';
import * as React from 'react';
import { Query, WithApolloClient, withApollo } from 'react-apollo';
import { Trans, translate } from 'react-i18next';

import { Page, PageSection } from '../../../../components/page';
import VoterElections from './components/VoterElections';
import { electionGroupWithOrderedElections } from '../../../../utils/processGraphQLData';
import {
  ElectionGroup,
  VotersForPerson,
  SignedInPerson,
} from '../../../../interfaces';
import { getSignedInPersonId } from '../../../../gql';

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

interface IProps {}

type PropsInternal = WithApolloClient<IProps>;

interface IState {
  personId: string;
  canVoteElectionGroups: string[] | null;
}

interface IViwerReturn {
  signedInPerson: SignedInPerson;
}

interface IVotersForPersonReturn {
  votersForPerson: VotersForPerson[];
}

class VoterFrontPage extends React.Component<PropsInternal, IState> {
  constructor(props: PropsInternal) {
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
    try {
      const person = await this.props.client.query<IViwerReturn>({
        query: getSignedInPersonId,
      });
      this.setState({ personId: person.data.signedInPerson.personId });
    } catch (err) {
      this.setState({ canVoteElectionGroups: [] });
      return;
    }

    try {
      const elections = await this.props.client.query<IVotersForPersonReturn>({
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
    return (
      <Query query={electionGroupsQuery}>
        {({ data, loading, error }) => {
          if (loading || error || this.state.canVoteElectionGroups === null) {
            return null;
          }
          return (
            <Page header={<Trans>general.welcome</Trans>}>
              <PageSection desc={<Trans>general.frontPageDesc</Trans>} noBorder>
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

export default translate()(withApollo(VoterFrontPage));
