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
  IPollBook,
  Viewer,
} from '../../../../interfaces';

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
        name
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

// Get id of signed in person
const getSignedInPersonId = gql`
  query {
    viewer {
      person {
        id
      }
    }
  }
`;

interface IProps {}

type PropsInternal = WithApolloClient<IProps>;

interface IState {
  personId: string;
  personElections: IPollBook[] | null;
}

interface IViwerReturn {
  viewer: Viewer;
}

interface IVotersForPersonReturn {
  votersForPerson: VotersForPerson[];
}

class VoterFrontPage extends React.Component<PropsInternal, IState> {
  constructor(props: PropsInternal) {
    super(props);

    this.state = {
      personId: '',
      personElections: null,
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
      this.setState({ personId: person.data.viewer.person.id });
    } catch (err) {
      this.setState({ personElections: [] });
      return;
    }

    try {
      const elections = await this.props.client.query<IVotersForPersonReturn>({
        query: votersForPersonQuery,
        variables: { id: this.state.personId },
      });
      if (elections.data.votersForPerson === null) {
        this.setState({ personElections: [] });
      } else {
        this.setState({
          personElections: elections.data.votersForPerson.map(a => a.pollbook),
        });
      }
    } catch (err) {
      this.setState({ personElections: [] });
    }
  }

  render() {
    return (
      <Query query={electionGroupsQuery}>
        {({ data, loading, error }) => {
          if (loading || error || this.state.personElections === null) {
            return null;
          }
          return (
            <Page header={<Trans>general.welcome</Trans>}>
              <PageSection desc={<Trans>general.frontPageDesc</Trans>} noBorder>
                <VoterElections
                  votersForPerson={this.state.personElections}
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
