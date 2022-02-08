import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { Trans } from 'react-i18next';

import {
  IActiveComponentProps,
  IInactiveComponentProps,
  ISettingsSectionContents,
} from 'components/page/SettingsSection';
import { ElectionNameInput } from 'interfaces';

import ElectionNameValues from './ElectionNameValues';
import ElectionNameForm from './ElectionNameForm';

const updateElectionName = gql`
  mutation UpdateElectionGroupName(
    $electionGroupId: UUID!
    $name: ElectionName!
  ) {
    updateElectionGroupName(
      electionGroupId: $electionGroupId
      nameDict: $name
    ) {
      ok
    }
  }
`;

const refetchQueriesFunction = () => ['electionGroup'];

const ActiveComponent: React.SFC<IActiveComponentProps> = (props) => {
  const { electionGroupData } = props;

  return (
    <Mutation
      mutation={updateElectionName}
      refetchQueries={refetchQueriesFunction}
      awaitRefetchQueries
    >
      {(mutation: any) => {
        const handleSubmit = async (
          electionNameSettings: ElectionNameInput
        ) => {
          await mutation({ variables: electionNameSettings });
          props.submitAction();
        };

        return (
          <ElectionNameForm
            electionGroup={electionGroupData}
            onSubmit={handleSubmit}
            closeAction={props.closeAction}
          />
        );
      }}
    </Mutation>
  );
};

const InactiveComponent: React.SFC<IInactiveComponentProps> = (props) => {
  const { electionGroupData } = props;

  return <ElectionNameValues electionGroup={electionGroupData} />;
};

const ElectionNameSettingsSection: ISettingsSectionContents = {
  sectionName: 'ElectionName',
  activeComponent: ActiveComponent,
  inactiveComponent: InactiveComponent,
  header: <Trans>election.electionName</Trans>,
  description: <Trans>election.electionNameDescription</Trans>,
};

export default ElectionNameSettingsSection;
