import { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Trans, useTranslation } from 'react-i18next';
import { History } from 'history';

import { isCreatingNewElectionVar } from 'cache';
import { ElectionGroup } from 'interfaces';

import Button, { ButtonContainer } from 'components/button';
import Page from 'components/page/Page';
import { ISettingsSectionContents } from 'components/page/SettingsSection';
import SettingsSectionsGroup from 'components/page/SettingsSectionsGroup';

import AdminRolesSettingsSection from './components/AdminRolesSettings';
import BaseElectionSettingsSection from './components/BaseElectionSettings';
import ElectionNameSettingsSection from './components/ElectionNameSettings';
import VotingPeriodSettingsSection from './components/VotingperiodSettings';
import VoterInfoSettingsSection from './components/VoterInfoSettings';

// Get the isCreatingNewElection bool from the local state cache.
const isCreatingNewElectionQuery = gql`
  query GetIsCreatingNewElection {
    isCreatingNewElection @client
  }
`;

const defaultSettingsSectionsContents: ISettingsSectionContents[] = [
  BaseElectionSettingsSection,
  ElectionNameSettingsSection,
  VotingPeriodSettingsSection,
  VoterInfoSettingsSection,
  AdminRolesSettingsSection,
];

interface IProps {
  electionGroupData: ElectionGroup;
  // handleUpdate?: () => Promise<any>; // TODO: Isn't used. Delete?
  history: History;
}

export default function InfoPage(props: IProps) {
  const { electionGroupData, history } = props;
  const { t } = useTranslation();

  useEffect(
    // Set isCreatingNewElection to false after the components unmounts.
    () => () => {
      isCreatingNewElectionVar(false);
    },
    []
  );

  const isSingleElection = electionGroupData.type === 'single_election';
  let settingsSectionsContents: ISettingsSectionContents[];
  if (isSingleElection) {
    settingsSectionsContents = defaultSettingsSectionsContents.slice(1);
  } else {
    settingsSectionsContents = defaultSettingsSectionsContents.slice();
  }

  const { id: groupId, meta } = electionGroupData;

  const proceedToCandidates = () => {
    history.push(`/admin/elections/${groupId}/candidates`);
  };

  const { data } = useQuery(isCreatingNewElectionQuery);
  const { isCreatingNewElection } = data;

  const handleSettingsWasSaved = () => {};
  // TODO actually do something here..
  // if (handleUpdate) {
  // handleUpdate().then(
  //  () => null,
  //   (error: string) => console.error(error)
  // );
  // }
  // };

  return (
    <Page header={t('election.electionInfo')}>
      <SettingsSectionsGroup
        settingsSectionsContents={settingsSectionsContents}
        electionGroupData={electionGroupData}
        startWithDirectedFlowActive={isCreatingNewElection}
        onSettingsWasSaved={handleSettingsWasSaved}
      />

      <ButtonContainer alignRight noTopMargin={false}>
        <Button
          text={
            <span>
              <Trans>election.goTo</Trans>&nbsp;
              {meta.candidateType === 'poll' ? (
                <Trans>admin.pollElec.alternatives</Trans>
              ) : (
                <Trans>election.candidates</Trans>
              )}
            </span>
          }
          action={proceedToCandidates}
          disabled={
            electionGroupData.elections.filter((e: any) => e.active).length ===
            0
          }
          iconRight="mainArrow"
        />
      </ButtonContainer>
    </Page>
  );
}
