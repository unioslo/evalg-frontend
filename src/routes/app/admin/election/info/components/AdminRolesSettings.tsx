import React from 'react';
import { ApolloConsumer, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Trans } from 'react-i18next';

import {
  IActiveComponentProps,
  IInactiveComponentProps,
  ISettingsSectionContents,
} from 'components/page/SettingsSection';
import {
  ElectionGroup,
  IElectionGroupRole,
  IRoleGrant,
  PersonIdType,
} from 'interfaces';

import AdminRolesValues from './AdminRolesValues';
import AdminRolesForm from './AdminRolesForm';

const addElectionGroupRoleByIdentifierMutation = gql`
  mutation addElectionGroupRoleByIdentifier(
    $electionGroupId: UUID!
    $role: ElectionGroupRoleType!
    $idType: PersonIdType!
    $idValue: String!
  ) {
    addElectionGroupRoleByIdentifier(
      electionGroupId: $electionGroupId
      role: $role
      idType: $idType
      idValue: $idValue
    ) {
      success
      code
      message
    }
  }
`;

const removeElectionGroupRoleByGrantMutation = gql`
  mutation removeElectionGroupRoleByGrant($grantId: UUID!) {
    removeElectionGroupRoleByGrant(grantId: $grantId) {
      success
      code
      message
    }
  }
`;

const refetchQueriesFunction = () => ['electionGroup'];

const ActiveComponent: React.SFC<IActiveComponentProps> = props => {
  const electionGroupData: ElectionGroup = props.electionGroupData;
  const adminRoles: IElectionGroupRole[] = electionGroupData.roles.filter(
    role => role.name === 'admin'
  );

  return (
    <ApolloConsumer>
      {client => {
        return (
          <Mutation
            mutation={removeElectionGroupRoleByGrantMutation}
            refetchQueries={refetchQueriesFunction}
          >
            {(removeAdmin, { data: removeData }) => (
              <Mutation
                mutation={addElectionGroupRoleByIdentifierMutation}
                refetchQueries={refetchQueriesFunction}
              >
                {(addAdmin, { data: addData }) => {
                  const addAction = (
                    role: string,
                    idType: PersonIdType,
                    idValue: string
                  ) => {
                    addAdmin({
                      variables: {
                        electionGroupId: electionGroupData.id,
                        role: role,
                        idType: idType,
                        idValue: idValue,
                      },
                    });
                  };

                  const removeAction = (role: IRoleGrant) => {
                    removeAdmin({ variables: { grantId: role.grantId } });
                  };

                  return (
                    <AdminRolesForm
                      adminRoles={adminRoles}
                      onAddRole={addAction}
                      onRemoveRole={removeAction}
                      onClose={props.submitAction}
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
  header: <Trans>admin.roles.sectionHeader</Trans>,
  description: <Trans>admin.roles.sectionDescription</Trans>,
};

export default AdminRolesSettingsSection;
