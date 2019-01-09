/* @flow */
import * as React from 'react';
import { translate, Trans } from 'react-i18next';
import { ApolloConsumer, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { SettingsSection } from 'components/page';
import AdminRolesValues from './AdminRolesValues';
import AdminRolesForm from './AdminRolesForm';

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

type Props = {
  children?: ReactChildren,
  active: boolean,
  setActive: Function,
  closeAction: Function,
  electionGroup: ElectionGroup,
  getAdminElectionGroup: Function,
  i18n: Object,
};

const AdminRolesSection = (props: Props) => {
  const { active, setActive, electionGroup, closeAction } = props;

  const adminRoles = electionGroup.roles.filter(
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

  const activeElement = (
    <ApolloConsumer>
      {client => {
        async function searchPersons(val) {
          const { data } = await client.query({
            query: searchPersonsQuery,
            variables: { val },
          });
          return data.searchPersons;
        }
        async function searchGroups(val) {
          const { data } = await client.query({
            query: searchGroupsQuery,
            variables: { val },
          });
          return data.searchGroups;
        }
        return (
          <Mutation
            mutation={removeAdminMutation}
            refetchQueries={() => ['electionGroup']}
          >
            {(removeAdmin, { data: removeData }) => (
              <Mutation
                mutation={addAdminMutation}
                refetchQueries={() => ['electionGroup']}
              >
                {(addAdmin, { data: addData }) => {
                  const addAction = (adminId, type) => {
                    addAdmin({
                      variables: {
                        adminId,
                        type,
                        elGrpId: electionGroup.id,
                      },
                    });
                  };

                  const removeAction = grantId => {
                    removeAdmin({ variables: { grantId } });
                  };

                  return (
                    <AdminRolesForm
                      adminPersons={adminPersons}
                      adminGroups={adminGroups}
                      addAction={addAction}
                      removeAction={removeAction}
                      closeAction={closeAction}
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

  const inactiveElement = <AdminRolesValues roles={electionGroup.roles} />;

  return (
    <SettingsSection
      header={<Trans>election.adminRoles</Trans>}
      desc={<Trans>election.adminRolesDesc</Trans>}
      active={active}
      setActive={setActive}
      activeElement={activeElement}
      inactiveElement={inactiveElement}
    />
  );
};

export default translate()(AdminRolesSection);
