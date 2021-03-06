import React from 'react';
import { History, Location } from 'history';
import { Route, match as matchType } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { NotFound, ErrorPageSection } from 'components/errors';
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
  ${ElectionGroupCountFields}
  query electionGroup($id: UUID!) {
    electionGroup(id: $id) {
      ...ElectionGroupFields
      latestElectionGroupCount {
        ...ElectionGroupCountFields
      }
      announcementBlockers
      publicationBlockers
      elections {
        ...ElectionFields
        pollbooks {
          id
          name
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
          ... on PersonPrincipal {
            id
            person {
              id
              displayName
              lastUpdate
            }
          }
          ... on PersonIdentifierPrincipal {
            id
            idType
            idValue
          }
          ... on GroupPrincipal {
            id
            group {
              id
              name
            }
          }
        }
      }
    }
  }
`;

interface IProps {
  location: Location;
  match: matchType<{ groupId: string }>;
  history: History;
  electionGroup: ElectionGroup;
}

const AdminElection: React.SFC<IProps> = (props: IProps) => {
  const { location, match } = props;
  return (
    <>
      <AdminStepper path={location.pathname} groupId={match.params.groupId} />
      <Query
        query={electionGroupQuery}
        variables={{ id: match.params.groupId }}
        fetchPolicy="network-only"
      >
        {(results: any) => {
          const { data, loading, error, refetch } = results;
          if (loading) {
            return (
              <div style={{ marginTop: '5rem' }}>
                <Loading />
              </div>
            );
          }
          if (error) {
            return <ErrorPageSection errorMessage={error.message} />;
          }
          if (data.electionGroup === null) {
            return <NotFound />;
          }

          // TODO: Check if this election group is actually manageable,
          // else mutations will fail and fields will be missing

          const egWithOrderedElections = electionGroupWithOrderedElections(
            data.electionGroup
          );

          return (
            <>
              <Route
                exact
                path="/admin/elections/:groupId/info"
                render={(routeProps) => (
                  <InfoPage
                    electionGroupData={egWithOrderedElections}
                    history={routeProps.history}
                  />
                )}
              />
              <Route
                path="/admin/elections/:groupId/candidates"
                render={(routeProps) => (
                  <CandidatesPage
                    electionGroup={egWithOrderedElections}
                    {...routeProps}
                  />
                )}
              />
              <Route
                path="/admin/elections/:groupId/pollbooks"
                render={(routeProps) => (
                  <PollbooksPage
                    groupId={match.params.groupId}
                    {...routeProps}
                  />
                )}
              />
              <Route
                path="/admin/elections/:groupId/status"
                render={(routeProps) => (
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
    </>
  );
};

export default AdminElection;
