import React from 'react';
import { History, Location } from 'history';
import { Route, match } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from 'components/loading';
import { electionGroupWithOrderedElections } from 'utils/processGraphQLData';
import { ElectionGroup } from 'interfaces';
import {
  ElectionGroupFields,
  ElectionFields,
  ElectionGroupCountFields,
} from 'fragments';

import AdminStepper from './components/AdminStepper';
import InfoPage from './info';
import CandidatesPage from './candidates';
import PollbooksPage from './pollbooks';
import StatusPage from './status';

const electionGroupQuery = gql`
  ${ElectionGroupFields}
  ${ElectionFields}
  query electionGroup($id: UUID!) {
    electionGroup(id: $id) {
      ...ElectionGroupFields
      # latestElectionGroupCount {
      #  ...ElectionGroupCountFields
      # }
      announcementBlockers
      publicationBlockers
      elections {
        ...ElectionFields
        pollbooks {
          id
          name
          nVerifiedVoters
          nVerifiedVotersWithVotes
        }
        lists {
          id
          name
          description
          informationUrl
          candidates {
            id
            name
            meta
            informationUrl
            priority
            preCumulated
            userCumulated
            listId
          }
        }
      }
      roles {
        name
        grantId
        principal {
          principalType
          person {
            id
            displayName
            lastUpdate
          }
          group {
            id
            name
          }
        }
      }
    }
  }
`;

interface IProps {
  location: Location;
  match: match<{ groupId: string }>;
  history: History;
  electionGroup: ElectionGroup;
}

// tslint:disable:jsx-no-lambda
const AdminElection: React.SFC<IProps> = (props: IProps) => (
  <Query
    query={electionGroupQuery}
    variables={{ id: props.match.params.groupId }}
    fetchPolicy="network-only"
  >
    {({ data, loading, error, refetch }) => {
      if (loading) {
        return <Loading />;
      }
      if (error) {
        return <p>Error!</p>;
      }

      const egWithOrderedElections = electionGroupWithOrderedElections(
        data.electionGroup
      );

      // const lang = props.i18n.language;
      return (
        <>
          <AdminStepper
            path={props.location.pathname}
            groupId={props.match.params.groupId}
          />
          <Route
            exact={true}
            path="/admin/elections/:groupId/info"
            render={routeProps => (
              <InfoPage
                electionGroupData={egWithOrderedElections}
                history={routeProps.history}
              />
            )}
          />
          <Route
            path="/admin/elections/:groupId/candidates"
            render={routeProps => (
              <CandidatesPage
                electionGroup={egWithOrderedElections}
                {...routeProps}
              />
            )}
          />
          <Route
            path="/admin/elections/:groupId/pollbooks"
            render={routeProps => (
              <PollbooksPage
                groupId={props.match.params.groupId}
                {...routeProps}
              />
            )}
          />
          <Route
            path="/admin/elections/:groupId/status"
            render={routeProps => (
              <StatusPage
                electionGroup={egWithOrderedElections}
                refetchElectionGroupFunction={refetch}
                {...routeProps}
              />
            )}
          />
        </>
      );
    }}
  </Query>
);

export default AdminElection;
