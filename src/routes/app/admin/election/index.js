/* @flow */
import * as React from 'react';
import { Route } from 'react-router-dom';
import { Query, graphql, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { translate } from 'react-i18next';

import ElectionNavBar from './components/ElectionNavBar';
import InfoPage from './info';
import CandidatesPage from './candidates';
import PollbooksPage from './pollbooks';
//import StatusPage from './status';
import Loading from 'components/loading';

import { findObjIndex } from 'utils';

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


type Props = {
  children?: React$Element<any>,
  location: Object,
  match: RouterMatch,
  history: RouterHistory,
  electionGroup: ElectionGroup,
  i18n: Object
};

const AdminElection = (props: Props) => (
  <Query
    query={electionGroupQuery}
    variables={{ id: props.match.params.groupId }}>
    {({ data: { electionGroup }, loading, error }) => {
      if (loading) {
        return <Loading />;
      }
      if (error) {
        return <p>Error!</p>;
      }
      const lang = props.i18n.language;
      return (
        <div>
          <ElectionNavBar
            path={props.location.pathname}
            groupId={props.match.params.groupId}
            lang={lang}
          />
          <Route path="/admin/elections/:groupId/info" render={(routeProps) =>
            <InfoPage
              electionGroup={electionGroup}
              lang={lang}
              history={routeProps.history} />
          } />
          <Route path="/admin/elections/:groupId/candidates" render={(routeProps) =>
            <CandidatesPage
              electionGroup={electionGroup}
              lang={lang}
              {...routeProps} />
          } />
          <Route path="/admin/elections/:groupId/pollbooks" render={(routeProps) =>
            <PollbooksPage
              groupId={props.match.params.groupId}
              {...routeProps} />
          } />
          {/* <Route path="/admin/elections/:groupId/status" render={(routeProps) =>
            <StatusPage
              electionGroup={electionGroup}
              lang={lang}
              {...routeProps} />
          } /> */}
        </div>
      )
    }}
  </Query>
);

export default translate()(AdminElection);