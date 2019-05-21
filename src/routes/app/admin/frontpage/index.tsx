import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import injectSheet from 'react-jss';
import { Trans, withTranslation } from 'react-i18next';

import Loading from 'components/loading';
import Page from 'components/page/Page';
import { PageSection } from 'components/page';
import { ActionButton } from 'components/button';
import Link from 'components/link';
import { electionGroupWithOrderedElections } from 'utils/processGraphQLData';
import { ElectionGroup } from 'interfaces';
import { ElectionGroupFields, ElectionFields } from 'fragments';

import ManageElectionsTable from './components/ManageElectionsTable';

const electionGroupsQuery = gql`
  ${ElectionGroupFields}
  ${ElectionFields}
  query {
    electionGroups {
      ...ElectionGroupFields
      elections {
        ...ElectionFields
        voteCount {
          selfAddedNotReviewed
          total
        }
      }
    }
  }
`;

const styles = (theme: any) => ({
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

const AdminFrontPage = (props: any) => {
  const { t } = props;
  return (
    <Query query={electionGroupsQuery} fetchPolicy="network-only">
      {({ loading, error, data }) => {
        if (loading) {
          return <Loading />;
        }
        if (error) {
          return <p>Error!</p>;
        }

        const electionGroupsWithOrderedElections = data.electionGroups.map(
          (electionGroup: ElectionGroup) =>
            electionGroupWithOrderedElections(electionGroup)
        );

        return (
          <Page header={<Trans>election.manageElections</Trans>}>
            <PageSection noBorder noBtmPadding>
              <Link to="/admin/newElection">
                <ActionButton text={t('election.createNewElection')} />
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
};

export default injectSheet(styles)(withTranslation()(AdminFrontPage));
