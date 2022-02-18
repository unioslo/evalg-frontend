import { Route, useLocation, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import { NotFound, ErrorPageSection } from 'components/errors';
import Loading from 'components/loading';
import { electionGroupWithOrderedElections } from 'utils/processGraphQLData';
import {
  ElectionGroupFields,
  ElectionFields,
  ElectionGroupCountFields,
} from 'fragments';

import AdminStepper from './components/AdminStepper';
import InfoPage from './info';
import CandidatesPage from './candidates';
import AddEditElectionList from './candidates/components/listElec/AddEditList';
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

export default function AdminElection() {
  let { groupId } = useParams<{ groupId: string }>();
  let location = useLocation();

  const { data, error, loading, refetch } = useQuery(electionGroupQuery, {
    variables: { id: groupId },
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <div style={{ marginTop: '5rem' }}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <AdminStepper path={location.pathname} groupId={groupId} />
        <ErrorPageSection errorMessage={error.message} />
      </>
    );
  }
  if (data.electionGroup === null) {
    return (
      <>
        <AdminStepper path={location.pathname} groupId={groupId} />
        <NotFound />;
      </>
    );
  }

  // TODO: Check if this election group is actually manageable,
  // else mutations will fail and fields will be missing

  const egWithOrderedElections = electionGroupWithOrderedElections(
    data.electionGroup
  );

  return (
    <>
      <AdminStepper path={location.pathname} groupId={groupId} />
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
        render={() => <CandidatesPage electionGroup={egWithOrderedElections} />}
      />
      <Route
        path="/admin/elections/:groupId/pollbooks"
        render={() => <PollbooksPage groupId={groupId} />}
      />
      <Route
        path="/admin/elections/:groupId/status"
        render={() => (
          <StatusPage
            electionGroup={egWithOrderedElections}
            refetchElectionGroupFunction={refetch}
          />
        )}
      />
      <Route
        path="/admin/elections/:groupId/addlist"
        render={() => (
          <AddEditElectionList electionGroup={egWithOrderedElections} />
        )}
      />
      <Route
        path="/admin/elections/:groupId/editlist/:listId"
        render={() => (
          <AddEditElectionList
            electionGroup={egWithOrderedElections}
            editList
          />
        )}
      />
    </>
  );
}
