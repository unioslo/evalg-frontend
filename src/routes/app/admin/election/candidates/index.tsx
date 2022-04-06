import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router';

import Button, { ButtonContainer } from 'components/button';
import Page from 'components/page/Page';
import { ElectionGroup } from 'interfaces';

import ListMainPage from './components/listElec/ListMainPage';
import PollElecAlternativeTable from './components/PollElecAlternativeTable';
import PrefElecCandTable from './components/PrefElecCandTable';
import PrefTeamElecCandTable from './components/PrefTeamElecCandTable';

const determineCandidatePage = (grpType: string, meta: any) => {
  if (meta.candidateType === 'single_team') {
    return PrefTeamElecCandTable;
  } else if (meta.candidateType === 'single') {
    if (grpType === 'multiple_elections') {
      return PrefElecCandTable;
    }
  } else if (meta.candidateType === 'poll') {
    return PollElecAlternativeTable;
  } else if (meta.candidateType === 'party_list') {
    return ListMainPage;
  }
  return PrefTeamElecCandTable;
};

const determineHeader = (type: string, meta: any) => {
  if (meta.candidateType === 'poll') {
    return 'admin.pollElec.alternatives';
  }
  return 'election.candidates';
};

export default function CandidatesPage({
  electionGroup,
}: {
  electionGroup: ElectionGroup;
}) {
  const [proceed, setProceed] = useState<boolean>(false);
  const { t } = useTranslation();
  const { elections, id: groupId } = electionGroup;

  if (elections.length === 0) {
    return (
      <Page>
        <p>No active elections.</p>;
      </Page>
    );
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
}
