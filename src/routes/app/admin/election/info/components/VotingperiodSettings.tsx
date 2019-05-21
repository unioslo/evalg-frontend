import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Trans } from 'react-i18next';

import {
  IActiveComponentProps,
  IInactiveComponentProps,
  ISettingsSectionContents,
} from 'components/page/SettingsSection';
import { Election, ElectionGroup, ElectionVotingPeriodInput } from 'interfaces';
import {
  ISODateTimeToTimeZoneAdjustedISODate,
  ISODateTimeToTimeZoneAdjustedTime,
  DateAndTimeToISODTWithTimeZonedOffset,
} from 'utils';

import VotingPeriodForm from './VotingPeriodForm';
import VotingPeriodValues from './VotingPeriodValues';

interface IVotingPeriodSettings {
  hasMultipleTimes: boolean;
  elections: ElectionVotingPeriodInput[];
}

const updateVotingPeriods = gql`
  mutation UpdateVotingPeriods(
    $hasMultipleTimes: Boolean!
    $elections: [ElectionVotingPeriodInput]!
  ) {
    updateVotingPeriods(
      hasMultipleTimes: $hasMultipleTimes
      elections: $elections
    ) {
      ok
    }
  }
`;

const buildInitialValues = (elecs: Election[]) => {
  const elections = elecs.map(e => ({
    id: e.id,
    name: e.name,
    startDate: ISODateTimeToTimeZoneAdjustedISODate(e.start),
    startTime: ISODateTimeToTimeZoneAdjustedTime(e.start),
    endDate: ISODateTimeToTimeZoneAdjustedISODate(e.end),
    endTime: ISODateTimeToTimeZoneAdjustedTime(e.end),
  }));
  let hasMultipleTimes = false;
  if (elecs.length > 1) {
    for (let i = 0; i < elecs.length - 1; i++) {
      if (
        elecs[i].start !== elecs[i + 1].start ||
        elecs[i].end !== elecs[i + 1].end
      ) {
        hasMultipleTimes = true;
        break;
      }
    }
  }
  return { elections, hasMultipleTimes };
};

const buildSubmitPayload = (submitValues: any): IVotingPeriodSettings => ({
  elections: submitValues.elections.map((e: any) => ({
    id: e.id,
    start: DateAndTimeToISODTWithTimeZonedOffset(e.startDate, e.startTime),
    end: DateAndTimeToISODTWithTimeZonedOffset(e.endDate, e.endTime),
  })),
  hasMultipleTimes: submitValues.hasMultipleTimes,
});

const refetchQueriesFunction = () => ['electionGroup'];

const ActiveComponent: React.SFC<IActiveComponentProps> = props => {
  const electionGroupData: ElectionGroup = props.electionGroupData;
  const activeElections = electionGroupData.elections.filter(e => e.active);

  return (
    <Mutation
      mutation={updateVotingPeriods}
      refetchQueries={refetchQueriesFunction}
      awaitRefetchQueries={true}
    >
      {(mutation, { data }) => {
        const handleSubmit = async (submitValues: any) => {
          await mutation({ variables: buildSubmitPayload(submitValues) });
          props.submitAction();
        };
        return (
          <VotingPeriodForm
            onSubmit={handleSubmit}
            closeAction={props.closeAction}
            electionType={electionGroupData.type}
            initialValues={buildInitialValues(activeElections)}
          />
        );
      }}
    </Mutation>
  );
};

const InactiveComponent: React.SFC<IInactiveComponentProps> = props => {
  const electionGroupData: ElectionGroup = props.electionGroupData;
  const activeElections = electionGroupData.elections.filter(e => e.active);

  return (
    <VotingPeriodValues
      electionGroup={electionGroupData}
      activeElections={activeElections}
    />
  );
};

const VotingPeriodSettingsSection: ISettingsSectionContents = {
  sectionName: 'votingPeriodSettings',
  activeComponent: ActiveComponent,
  inactiveComponent: InactiveComponent,
  header: <Trans>election.votingPeriod</Trans>,
  description: <Trans>election.votingPeriodSubHeader</Trans>,
};

export default VotingPeriodSettingsSection;
