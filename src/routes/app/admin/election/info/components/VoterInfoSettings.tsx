import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Trans } from 'react-i18next';

import {
  IActiveComponentProps,
  IInactiveComponentProps,
  ISettingsSectionContents,
} from 'components/page/SettingsSection';
import { Election, ElectionVoterInfoInput } from 'interfaces';

import VoterInfoForm from './VoterInfoForm';
import VoterInfoValues from './VoterInfoValues';

const buildInitialValues = (elecs: Election[]) => {
  const elections = elecs.map(e => ({
    id: e.id,
    name: e.name,
    mandatePeriodStart: e.mandatePeriodStart,
    mandatePeriodEnd: e.mandatePeriodEnd,
    contact: e.contact,
    informationUrl: e.informationUrl,
  }));
  let hasMultipleMandateTimes = false;
  if (elecs.length > 1) {
    for (let i = 0; i < elecs.length - 1; i += 1) {
      if (
        elecs[i].mandatePeriodStart !== elecs[i + 1].mandatePeriodStart ||
        elecs[i].mandatePeriodEnd !== elecs[i + 1].mandatePeriodEnd
      ) {
        hasMultipleMandateTimes = true;
        break;
      }
    }
  }
  let hasMultipleContactInfo = false;
  if (elecs.length > 1) {
    for (let i = 0; i < elecs.length - 1; i += 1) {
      if (elecs[i].contact !== elecs[i + 1].contact) {
        hasMultipleContactInfo = true;
        break;
      }
    }
  }
  let hasMultipleInfoUrls = false;
  if (elecs.length > 1) {
    for (let i = 0; i < elecs.length - 1; i += 1) {
      if (elecs[i].informationUrl !== elecs[i + 1].informationUrl) {
        hasMultipleInfoUrls = true;
        break;
      }
    }
  }
  return {
    elections,
    hasMultipleMandateTimes,
    hasMultipleContactInfo,
    hasMultipleInfoUrls,
  };
};

const buildPayload = (values: any) => {
  const {
    hasMultipleContactInfo,
    hasMultipleInfoUrls,
    hasMultipleMandateTimes,
    elections,
  } = values;

  return {
    ...values,
    elections: elections.map((e: ElectionVoterInfoInput) => ({
      id: e.id,
      mandatePeriodStart: hasMultipleMandateTimes
        ? e.mandatePeriodStart
        : elections[0].mandatePeriodStart,
      mandatePeriodEnd: hasMultipleMandateTimes
        ? e.mandatePeriodEnd
        : elections[0].mandatePeriodEnd,
      contact: hasMultipleContactInfo ? e.contact : elections[0].contact,
      informationUrl: hasMultipleInfoUrls
        ? e.informationUrl
        : elections[0].informationUrl,
    })),
  };
};

const updateVoterInfo = gql`
  mutation UpdateVoterInfo($elections: [ElectionVoterInfoInput]!) {
    updateVoterInfo(elections: $elections) {
      ok
    }
  }
`;

const refetchQueriesFunction = () => ['electionGroup'];

const ActiveComponent: React.SFC<IActiveComponentProps> = props => {
  const { electionGroupData } = props;
  const { elections } = electionGroupData;
  const activeElections = elections.filter(e => e.active);

  return (
    <Mutation
      mutation={updateVoterInfo}
      refetchQueries={refetchQueriesFunction}
      awaitRefetchQueries
    >
      {(mutation, { data }) => {
        const handleSubmit = async (values: any) => {
          await mutation({ variables: buildPayload(values) });
          props.submitAction();
        };
        return (
          <VoterInfoForm
            onSubmit={handleSubmit}
            closeAction={props.closeAction}
            electionGroup={electionGroupData}
            initialValues={buildInitialValues(activeElections)}
          />
        );
      }}
    </Mutation>
  );
};

const InactiveComponent: React.SFC<IInactiveComponentProps> = props => {
  const { electionGroupData } = props;
  const { elections } = electionGroupData;
  const activeElections = elections.filter(e => e.active);

  return (
    <VoterInfoValues
      electionGroup={electionGroupData}
      elections={activeElections}
    />
  );
};

const VoterInfoSettingsSection: ISettingsSectionContents = {
  sectionName: 'voterInfoSettings',
  activeComponent: ActiveComponent,
  inactiveComponent: InactiveComponent,
  header: <Trans>election.voterInfo</Trans>,
  description: <Trans>election.voterInfoFormDesc</Trans>,
};

export default VoterInfoSettingsSection;
