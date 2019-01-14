import * as React from 'react';
import { Route, match } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { translate } from 'react-i18next';

import ElectionNavBar from './components/ElectionNavBar';
import InfoPage from './info';
import CandidatesPage from './candidates';
import PollbooksPage from './pollbooks';
import StatusPage from './status';
import Loading from 'components/loading';
import { History, Location } from 'history';
import { i18n } from 'i18next';

const electionGroupQuery = gql`
  query electionGroup($id: UUID!) {
    electionGroup(id: $id) {
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
      announced
      deleted
      announcementBlockers
      publicationBlockers
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
        role
        grantId
        principal {
          principalType
          person {
            id
            username
            firstName
            lastName
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
  i18n: i18n;
}

// tslint:disable:jsx-no-lambda
const AdminElection: React.SFC<IProps> = (props: IProps) => (
  <Query
    query={electionGroupQuery}
    variables={{ id: props.match.params.groupId }}
  >
    {({ data: { electionGroup }, loading, error }) => {
      if (loading) {
        return <Loading />;
      }
      if (error) {
        return <p>Error!</p>;
      }
      const lang = props.i18n.language;
      return (
        <>
          <ElectionNavBar
            path={props.location.pathname}
            groupId={props.match.params.groupId}
            lang={lang}
          />
          <Route
            path="/admin/elections/:groupId/info/new"
            render={routeProps => (
              <InfoPage
                isNewElection={true}
                electionGroupData={electionGroup}
                history={routeProps.history}
              />
            )}
          />
          <Route
            exact={true}
            path="/admin/elections/:groupId/info"
            render={routeProps => (
              <InfoPage
                electionGroupData={electionGroup}
                history={routeProps.history}
              />
            )}
          />
          <Route
            path="/admin/elections/:groupId/candidates"
            render={routeProps => (
              <CandidatesPage
                electionGroup={electionGroup}
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
                electionGroup={electionGroup}
                {...routeProps}
              />
            )}
          />
        </>
      );
    }}
  </Query>
);

export default translate()(AdminElection);
