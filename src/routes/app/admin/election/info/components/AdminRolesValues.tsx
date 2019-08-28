import React from 'react';
import { Trans } from 'react-i18next';

import Text from 'components/text';
import { PageSubSection } from 'components/page';
import { IElectionGroupRole } from 'interfaces';

interface IProps {
  roles: IElectionGroupRole[];
}

class AdminRolesValues extends React.Component<IProps> {
  render() {
    const { roles } = this.props;
    const adminRoles = roles.filter(role => role.name === 'admin');
    const adminRoleNames = adminRoles.map(role => {
      if (role.principal.__typename === 'PersonPrincipal') {
        return role.principal.person.displayName;
      } else if (role.principal.__typename === 'PersonIdentifierPrincipal') {
        return role.principal.idValue;
      } else if (role.principal.__typename === 'GroupPrincipal') {
        return role.principal.group.name;
      }
      return null;
    });
    return (
      <PageSubSection header={<Trans>admin.roles.electionAdmins</Trans>}>
        <Text>{adminRoleNames.join(', ')}</Text>
      </PageSubSection>
    );
  }
}

export default AdminRolesValues;
