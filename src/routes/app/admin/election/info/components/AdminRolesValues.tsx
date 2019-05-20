import React from 'react';
import { Trans } from 'react-i18next';

import Text from '../../../../../../components/text';
import { PageSubSection } from '../../../../../../components/page';
import { IElectionGroupRole } from '../../../../../../interfaces';

interface IProps {
  roles: IElectionGroupRole[];
}

class AdminRolesValues extends React.Component<IProps> {
  render() {
    const { roles } = this.props;
    const adminRoles = roles.filter(role => role.name === 'election-admin');
    const adminRoleNames = adminRoles.map(role => {
      if (role.principal.principalType === 'person-principal') {
        return role.principal.person.displayName;
      } else if (role.principal.principalType === 'group-principal') {
        return role.principal.group.name;
      } else {
        return null;
      }
    });
    return (
      <PageSubSection header={<Trans>election.electionAdmins</Trans>}>
        <Text>{adminRoleNames.join(', ')}</Text>
      </PageSubSection>
    );
  }
}

export default AdminRolesValues;
