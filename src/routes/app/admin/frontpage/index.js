/* @flow */
import * as React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Link } from 'react-router-dom';
import Loading from 'components/loading';
import Page from 'components/page/Page';
import { PageSection } from 'components/page'
import { Trans } from 'react-i18next';;
import { ActionButton } from 'components/button'
import ManageElectionsTable from './components/ManageElectionsTable';

import { objPropsToArray } from 'utils';

const electionGroupsQuery = gql`
  query {
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
      }
    }
  }
`;

const getTextsQuery = gql`
  query {
    lang @client
  }
`;

const AdminFrontPage = () => (
  <Query query={electionGroupsQuery}>
    {({ loading, error, data }) => {
      if (loading) {
        return <Loading />;
      }
      if (error) {
        return <p>Error!</p>;
      }
      return (
        <Page header={<Trans>election.manageElections</Trans>} >
          <PageSection noBorder noBtmPadding>
            <Link to="/admin/newElection">
              <ActionButton
                text={<Trans>election.createNewElection</Trans>}
              />
            </Link>
          </PageSection>
          <PageSection
            noBorder
            header={<Trans>election.manageableElections</Trans>}>
            <ManageElectionsTable
              electionGroups={data.electionGroups}
            />
          </PageSection>
        </Page>
      )
    }}
  </Query>
);

export default AdminFrontPage;
