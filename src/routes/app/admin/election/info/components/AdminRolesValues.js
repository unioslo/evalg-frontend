import * as React from 'react';

import Text from 'components/text';
import { Trans } from 'react-i18next';
import { PageSubSection } from 'components/page';

type Props = {
  roles: Object
}

const AdminRolesValues = (props: Props) => {
  const { roles } = props;
  const adminRoles = roles.filter(role => role.role === 'election-admin');
  const adminRoleNames = adminRoles.map(role => {
    if (role.principal.principalType === 'person-principal') {
      return [role.principal.person.firstName,
      role.principal.person.lastName].join(' ')
    }
    else if (role.principal.principalType === 'group-principal') {
      return role.principal.group.name
    }
    else {
      return null;
    }
  });
  return (
    <PageSubSection header={<Trans>election.electionAdmins</Trans>}>
      <Text>
        {adminRoleNames.join(', ')}
      </Text>
    </PageSubSection>
  )
};

export default AdminRolesValues;