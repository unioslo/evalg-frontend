/* @flow */
import * as React from 'react';
import { translate, Trans } from 'react-i18next';

import Text from 'components/text';
import { InfoList, InfoListItem } from 'components/infolist';

type Props = {
  electionGroup: ElectionGroup,
  i18n: Object,
};

const BaseElectionSettingsValues = (props: Props) => {
  const lang = props.i18n.language;
  const { elections } = props.electionGroup;
  const activeElections = elections.filter(e => e.active);
  const hasGenderQuota = props.electionGroup.hasGenderQuota;
  return (
    <InfoList>
      {activeElections.length === 0 && (
        <InfoListItem>
          <Trans>election.noActiveElections</Trans>
        </InfoListItem>
      )}
      {activeElections.map((election, index) => {
        return (
          <InfoListItem key={index}>
            {election.name[lang]} -&nbsp;
            <Text bold inline>
              {election.meta.candidateRules.seats}&nbsp;
              <Trans>election.candidatesShort</Trans>,&nbsp;
              {election.meta.candidateRules.substitutes}&nbsp;
              <Trans>election.coCandidatesShort</Trans>
            </Text>
          </InfoListItem>
        );
      })}
      {hasGenderQuota && (
        <InfoListItem smallText>
          <Trans>election.hasGenderQuota</Trans>
        </InfoListItem>
      )}
    </InfoList>
  );
};

export default translate()(BaseElectionSettingsValues);
