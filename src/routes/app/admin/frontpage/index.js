/* @flow */
import * as React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import injectSheet from 'react-jss';
import { Trans, translate } from 'react-i18next';

import { objPropsToArray } from 'utils';
import Loading from 'components/loading';
import Page from 'components/page/Page';
import { PageSection } from 'components/page';
import { ActionButton } from 'components/button';
import ManageElectionsTable from './components/ManageElectionsTable';
import Link from 'components/link';
import { electionGroupWithOrderedElections } from 'utils/processGraphQLData';

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

const styles = theme => ({
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  helpLinksBox: {
    width: '35rem',
    padding: '2.5rem 3.5rem',
    border: `0.4rem solid`,
    borderRadius: '0.4rem',
    borderColor: theme.helpBoxBorderColor,
    '& .title': {
      fontSize: '2.4rem',
      marginBottom: '1.5rem',
    },
  },
});

const AdminFrontPage = props => (
  <Query query={electionGroupsQuery}>
    {({ loading, error, data }) => {
      if (loading) {
        return <Loading />;
      }
      if (error) {
        return <p>Error!</p>;
      }

      const electionGroupsWithOrderedElections = data.electionGroups.map(
        elGrp => electionGroupWithOrderedElections(elGrp)
      );

      return (
        <Page header={<Trans>election.manageElections</Trans>}>
          <PageSection noBorder noBtmPadding>
            <Link to="/admin/newElection">
              <ActionButton text={<Trans>election.createNewElection</Trans>} />
            </Link>
          </PageSection>
          <PageSection
            noBorder
            header={<Trans>election.manageableElections</Trans>}
          >
            <ManageElectionsTable
              electionGroups={electionGroupsWithOrderedElections}
            />
          </PageSection>
        </Page>
      );
    }}
  </Query>
);

export default translate()(injectSheet(styles)(AdminFrontPage));
