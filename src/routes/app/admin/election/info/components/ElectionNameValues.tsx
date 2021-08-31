import React from 'react';
import { useTranslation } from 'react-i18next';
import { WithTranslation, withTranslation } from 'react-i18next';

import Text from 'components/text';
import { InfoList } from 'components/infolist';
import { ElectionGroup } from 'interfaces';

interface IProps extends WithTranslation {
  electionGroup: ElectionGroup;
}

// This is only relevant for "inactiveComponent" whatever that means

const ElectionNameValues: React.SFC<IProps> = props => {
  const { electionGroup } = props;
  return (
    <InfoList>
      <Text>{electionGroup.name['en']}</Text>
      <Text>{electionGroup.name['nb']}</Text>
      <Text>{electionGroup.name['nn']}</Text>
    </InfoList>
  );
};

export default withTranslation()(ElectionNameValues);
