import * as React from 'react';
import { ApolloConsumer, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import AdminRolesValues from './AdminRolesValues';
import AdminRolesForm from './AdminRolesForm';
import { IActiveComponentProps, IInactiveComponentProps, ISettingsSectionContents } from 'components/page/SettingsSection';
import { Trans } from 'react-i18next';

const searchPersonsQuery = gql`
  query searchPersons($val: String!) {
    searchPersons(val: $val) {
      id
      firstName
      lastName
    }
  }
`;

const searchGroupsQuery = gql`
  query searchGroups($val: String!) {
    searchGroups(val: $val) {
      id
      name
    }
  }
`;

const addAdminMutation = gql`
  mutation AddAdmin($adminId: UUID!, $type: String!, $elGrpId: UUID!) {
    addAdmin(adminId: $adminId, type: $type, elGrpId: $elGrpId) {
      ok
    }
  }
`;

const removeAdminMutation = gql`
  mutation RemoveAdmin($grantId: UUID!) {
    removeAdmin(grantId: $grantId) {
      ok
    }
  }
`;

const refetchQueriesFunction = () => ['electionGroup'];

const ActiveComponent: React.SFC<IActiveComponentProps> = props => {
  const electionGroupData: ElectionGroup = props.electionGroupData;
  const adminRoles = electionGroupData.roles.filter(
    r => r.role === 'election-admin'
  );

  const adminPersons = adminRoles
    .filter(r => r.principal.principalType === 'person-principal')
    .map(r => ({
      id: r.principal.person.id,
      firstName: r.principal.person.firstName,
      lastName: r.principal.person.lastName,
      username: r.principal.person.username,
      grantId: r.grantId,
    }));

  const adminGroups = adminRoles
    .filter(r => r.principal.principalType === 'group-principal')
    .map(r => ({
      id: r.principal.group.id,
      name: r.principal.group.name,
      grantId: r.grantId,
    }));

  return (
    <ApolloConsumer>
      {client => {
        async function searchPersons(val: string) {
          const { data }: { data: any } = await client.query({
            query: searchPersonsQuery,
            variables: { val },
          });
          return data.searchPersons;
        }
        async function searchGroups(val: string) {
          const { data }: { data: any } = await client.query({
            query: searchGroupsQuery,
            variables: { val },
          });
          return data.searchGroups;
        }
        return (
          <Mutation
            mutation={removeAdminMutation}
            refetchQueries={refetchQueriesFunction}
          >
            {(removeAdmin, { data: removeData }) => (
              <Mutation
                mutation={addAdminMutation}
                refetchQueries={refetchQueriesFunction}
              >
                {(addAdmin, { data: addData }) => {
                  const addAction = (adminId: any, type: string) => {
                    addAdmin({
                      variables: {
                        adminId,
                        type,
                        elGrpId: electionGroupData.id,
                      },
                    });
                  };

                  const removeAction = (grantId: any) => {
                    removeAdmin({ variables: { grantId } });
                  };

                  return (
                    <AdminRolesForm
                      adminPersons={adminPersons}
                      adminGroups={adminGroups}
                      addAction={addAction}
                      removeAction={removeAction}
                      closeAction={props.submitAction}
                      searchPersons={searchPersons}
                      searchGroups={searchGroups}
                    />
                  );
                }}
              </Mutation>
            )}
          </Mutation>
        );
      }}
    </ApolloConsumer>
  );
};

const InactiveComponent: React.SFC<IInactiveComponentProps> = props => (
  <AdminRolesValues roles={props.electionGroupData.roles} />
);

const AdminRolesSettingsSection: ISettingsSectionContents = {
  sectionName: 'adminRolesSettings',
  activeComponent: ActiveComponent,
  inactiveComponent: InactiveComponent,
  header: <Trans>election.adminRoles</Trans>,
  description: <Trans>election.adminRolesDesc</Trans>
};

export default AdminRolesSettingsSection;
