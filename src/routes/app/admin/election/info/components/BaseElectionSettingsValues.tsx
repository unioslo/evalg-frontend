import React from 'react';
import { useTranslation } from 'react-i18next';
import { WithTranslation, withTranslation } from 'react-i18next';

import Text from 'components/text';
import { InfoList, InfoListItem } from 'components/infolist';
import { ElectionGroup } from 'interfaces';

interface IProps extends WithTranslation {
  electionGroup: ElectionGroup;
}

const BaseElectionSettingsValues: React.SFC<IProps> = props => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { elections } = props.electionGroup;
  const activeElections = elections.filter(e => e.active);
  const {electionGroup} = props;
  return (
    <InfoList>
      {activeElections.length === 0 && (
        <InfoListItem>{t('election.noActiveElections')}</InfoListItem>
      )}
      {activeElections.map((election: any, index: any) => {
        return (
          <InfoListItem key={index}>
            {election.name[lang]}:{' '}
            <Text bold inline>
              {election.meta.candidateRules.seats}&nbsp;
              {t('election.candidatesShort')},&nbsp;
              {election.meta.candidateRules.substitutes}&nbsp;
              {t('election.coCandidatesShort')}
            </Text>
          </InfoListItem>
        );
      })}
      {electionGroup.hasGenderQuota && (
        <InfoListItem smallText>
          {t('election.hasGenderQuota')}
        </InfoListItem>
      )}
    </InfoList>
  );
};

export default withTranslation()(BaseElectionSettingsValues);
