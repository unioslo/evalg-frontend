import * as React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import BaseElectionSettingsValues from './BaseElectionSettingsValues';
import BaseElectionSettingsForm, {
  IElectionsBaseSettings,
} from './BaseElectionSettingsForm';
import {
  IActiveComponentProps,
  IInactiveComponentProps,
  ISettingsSectionContents,
} from 'components/page/SettingsSection';
import { Trans } from 'react-i18next';

const updateBaseSettings = gql`
  mutation UpdateBaseSettings(
    $id: UUID!
    $hasGenderQuota: Boolean!
    $elections: [ElectionBaseSettingsInput]!
  ) {
    updateBaseSettings(
      id: $id
      hasGenderQuota: $hasGenderQuota
      elections: $elections
    ) {
      ok
    }
  }
`;

const refetchQueriesFunction = () => ['electionGroup'];

const ActiveComponent: React.SFC<IActiveComponentProps> = props => {
  const electionGroupData: ElectionGroup = props.electionGroupData;

  if (electionGroupData.type !== 'multiple_elections') {
    return null;
  }

  return (
    <Mutation
      mutation={updateBaseSettings}
      refetchQueries={refetchQueriesFunction}
      awaitRefetchQueries={true}
    >
      {(mutation, { data }) => {
        const handleSubmit = async (
          electionBaseSettings: IElectionsBaseSettings
        ) => {
          await mutation({ variables: electionBaseSettings });
          props.submitAction();
        };

        return (
          <BaseElectionSettingsForm
            electionGroup={electionGroupData}
            onSubmit={handleSubmit}
            closeAction={props.closeAction}
          />
        );
      }}
    </Mutation>
  );
};

const InactiveComponent: React.SFC<IInactiveComponentProps> = props => {
  const electionGroupData: ElectionGroup = props.electionGroupData;

  if (electionGroupData.type !== 'multiple_elections') {
    return null;
  }

  return <BaseElectionSettingsValues electionGroup={electionGroupData} />;
};

const BaseElectionSettingsSection: ISettingsSectionContents = {
  sectionName: 'baseElectionSettings',
  activeComponent: ActiveComponent,
  inactiveComponent: InactiveComponent,
  header: <Trans>election.voterSettings</Trans>,
  description: <Trans>election.activeElectionsHeader</Trans>,
};

export default BaseElectionSettingsSection;
