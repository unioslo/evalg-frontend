import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import { Trans } from 'react-i18next';

import {
  IActiveComponentProps,
  IInactiveComponentProps,
  ISettingsSectionContents,
} from 'components/page/SettingsSection';
import {
  ElectionGroupRoleType,
  IElectionGroupRole,
  IRoleGrant,
  IMutationResponse,
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

interface IAddElectionGroupRoleByIdentifierVariables {
  electionGroupId: string;
  role: ElectionGroupRoleType;
  idType: PersonIdType;
  idValue: string;
}

interface IAddElectionGroupRoleByIdentifierResponse {
  addElectionGroupRoleByIdentifier: IMutationResponse;
}

interface IRemoveElectionGroupRoleByGrantVariables {
  grantId: string;
}

interface IRemoveElectionGroupRoleByGrantResponse {
  removeElectionGroupRoleByGrant: IMutationResponse;
}

const addElectionGroupRoleByIdentifier = async (
  client: ApolloClient<any>,
  electionGroupId: string,
  role: ElectionGroupRoleType,
  idType: PersonIdType,
  idValue: string
): Promise<IMutationResponse | null> => {
  const response = await client.mutate<
    IAddElectionGroupRoleByIdentifierResponse,
    IAddElectionGroupRoleByIdentifierVariables
  >({
    mutation: addElectionGroupRoleByIdentifierMutation,
    variables: {
      electionGroupId: electionGroupId,
      role: role,
      idType: idType,
      idValue: idValue,
    },
    refetchQueries: () => ['electionGroup'],
  });

  return (
    (response &&
      response.data &&
      response.data.addElectionGroupRoleByIdentifier) ||
    null
  );
};

const removeElectionGroupRoleByGrant = async (
  client: ApolloClient<any>,
  grantId: string
): Promise<IMutationResponse> => {
  const response = await client.mutate({
    mutation: removeElectionGroupRoleByGrantMutation,
    variables: {
      grantId: grantId,
    },
    refetchQueries: () => ['electionGroup'],
  });

  return (
    (response &&
      response.data &&
      response.data.removeElectionGroupRoleByGrant) ||
    null
  );
};

const ActiveComponent: React.FunctionComponent<
  IActiveComponentProps
> = props => {
  const { electionGroupData } = props;
  const adminRoles: IElectionGroupRole[] = electionGroupData.roles.filter(
    role => role.name === 'admin'
  );

  return (
    <ApolloConsumer>
      {client => {
        const addAdmin = (
          role: ElectionGroupRoleType,
          idType: PersonIdType,
          idValue: string
        ) => {
          return addElectionGroupRoleByIdentifier(
            client,
            electionGroupData.id,
            role,
            idType,
            idValue
          );
        };

        const removeAdmin = (role: IRoleGrant) => {
          return removeElectionGroupRoleByGrant(client, role.grantId);
        };

        return (
          <AdminRolesForm
            adminRoles={adminRoles}
            onAddRole={addAdmin}
            onRemoveRole={removeAdmin}
            onClose={props.submitAction}
          />
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
