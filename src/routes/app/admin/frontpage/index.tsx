import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { useTranslation } from 'react-i18next';

import { NotFound, ErrorPageSection } from 'components/errors';
import Loading from 'components/loading';
import Page from 'components/page/Page';
import { PageSection } from 'components/page';
import { ActionButton } from 'components/button';
import Link from 'components/link';
import { electionGroupWithOrderedElections } from 'utils/processGraphQLData';
import { ElectionGroup, IRoleGrant, IElectionGroupRole } from 'interfaces';
import { ElectionGroupFields, ElectionFields } from 'fragments';

import ManageElectionsTable from './components/ManageElectionsTable';

const viewerElectionGroupsQuery = gql`
  ${ElectionGroupFields}
  ${ElectionFields}
  query ViewerElectionGroupsAndRoles {
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
    viewer {
      roles {
        ... on ElectionGroupRole {
          groupId
        }
      }
    }
  }
`;

const AdminFrontPage: React.FunctionComponent<{}> = () => {
  const { t } = useTranslation();
  return (
    <Query query={viewerElectionGroupsQuery} fetchPolicy="network-only">
      {(result: any) => {
        const { loading, error, data } = result;
        if (loading) {
          return <Loading />;
        }
        if (error) {
          return <ErrorPageSection errorMessage={error.message} />;
        }
        if (data.electionGroup === null) {
          return <NotFound />;
        }

        /* Filter out election groups which the viewer does not have a role for */
        const electionGroupRoles =
          data.viewer.roles &&
          data.viewer.roles.filter((role: IRoleGrant) => {
            return role.__typename === 'ElectionGroupRole';
          });
        const manageableElectionGroupIds = electionGroupRoles.map(
          (role: IElectionGroupRole) => {
            return role.groupId;
          }
        );

        const manageableElectionGroups = data.electionGroups.filter(
          (electionGroup: ElectionGroup) => {
            return manageableElectionGroupIds.includes(electionGroup.id);
          }
        );

        const electionGroupsWithOrderedElections = manageableElectionGroups.map(
          (electionGroup: ElectionGroup) =>
            electionGroupWithOrderedElections(electionGroup)
        );

        return (
          <Page header={t('election.manageElections')}>
            <PageSection noBorder noBtmPadding>
              <Link to="/admin/newElection">
                <ActionButton text={t('election.createNewElection')} />
              </Link>
            </PageSection>
            <PageSection
              noBorder
              header={<>{t('election.manageableElections')}</>}
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

export default AdminFrontPage;
