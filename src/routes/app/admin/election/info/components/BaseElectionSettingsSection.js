/* @flow */
import * as React from 'react';
import { translate, Trans } from 'react-i18next';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { SettingsSection } from 'components/page';
import BaseElectionSettingsValues from './BaseElectionSettingsValues';
import BaseElectionSettingsForm from './BaseElectionSettingsForm';

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

const buildInitialValues = electionGroup => ({
  elections: electionGroup.elections.map(e => ({
    id: e.id,
    active: e.active,
    name: e.name,
    seats: e.meta.candidateRules.seats,
    substitutes: e.meta.candidateRules.substitutes,
  })),
  hasGenderQuota: electionGroup.meta.candidateRules.candidateGender,
  id: electionGroup.id,
});

const buildPayload = values => ({
  ...values,
  elections: values.elections.map(e => ({
    id: e.id,
    active: e.active,
    seats: e.seats ? e.seats : 0,
    substitutes: e.substitutes ? e.substitutes : 0,
  })),
});

type Props = {
  children?: React.ChildrenArray<any>,
  activeStatus,
  setActive: Function,
  closeAction: Function,
  submitAction: Function,
  electionGroup: ElectionGroup,
  elections: Election[]
};

class BaseElectionSettingsSection extends React.Component<Props> {
  render() {
    const {
      active,
      setActive,
      submitAction,
      electionGroup,
      closeAction,
    } = this.props;

    const activeElement = (
      <Mutation
        mutation={updateBaseSettings}
        refetchQueries={() => ['electionGroup']}
      >
        {(mutation, { data }) => (
          <BaseElectionSettingsForm
            initialValues={buildInitialValues(electionGroup)}
            handleSubmit={values => {
              mutation({ variables: buildPayload(values) });
              closeAction();
            }}
            closeAction={closeAction}
          />
        )}
      </Mutation>
    );

    const inactiveElement = (
      <BaseElectionSettingsValues electionGroup={electionGroup} />
    );

    return (
      <SettingsSection
        header={<Trans>election.voterSettings</Trans>}
        desc={<Trans>election.activeElectionsHeader</Trans>}
        activeStatus={activeStatus}
        setActive={setActive}
        activeElement={activeElement}
        inactiveElement={inactiveElement}
      />
    );
  }
}

export default translate()(BaseElectionSettingsSection);
