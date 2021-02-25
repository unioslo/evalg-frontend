import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { useTranslation } from 'react-i18next';

import Page from 'components/page/Page';
import Button, { ButtonContainer } from 'components/button';
import { ElectionGroup } from 'interfaces';

import PrefElecCandTable from './components/PrefElecCandTable';
import PrefTeamElecCandTable from './components/PrefTeamElecCandTable';
import PollElecAlternativeTable from './components/PollElecAlternativeTable';

const determineCandidatePage = (grpType: string, metaData: any) => {
  console.info(grpType);
  console.info(metaData.candidateType);
  if (metaData.candidateType === 'single_team') {
    return PrefTeamElecCandTable;
  } else if (metaData.candidateType === 'single') {
    if (grpType === 'multiple_elections') {
      return PrefElecCandTable;
    }
  } else if (metaData.candidateType === 'poll') {
    return PollElecAlternativeTable;
  }
  return PrefTeamElecCandTable;
};

const determineHeader = (type: string, meta: any) => {
  if (meta.candidateType === 'poll') {
    return 'admin.pollElec.alternatives';
  }
  return 'election.candidates';
};
interface IProps {
  electionGroup: ElectionGroup;
}

const CandidatesPage: React.FunctionComponent<IProps> = props => {
  const [proceed, setProceed] = useState<boolean>(false);

  const { t } = useTranslation();

  const { electionGroup } = props;
  const { elections, id: groupId } = electionGroup;

  if (elections.length === 0) {
    return <p>No active elections.</p>;
  }

  const { type, meta } = electionGroup;
  const CandidatePage = determineCandidatePage(type, meta);

  return (
    <Page header={t(determineHeader(type, meta))}>
      <CandidatePage electionGroup={electionGroup} />
      <ButtonContainer alignRight noTopMargin={false}>
        <Button
          text={
            <span>
              {t('election.goTo')}&nbsp;
              {t('election.censuses')}
            </span>
          }
          action={() => setProceed(true)}
          iconRight="mainArrow"
        />
      </ButtonContainer>
      {proceed ? (
        <Redirect push to={`/admin/elections/${groupId}/pollbooks`} />
      ) : null}
    </Page>
  );
};

export default CandidatesPage;
