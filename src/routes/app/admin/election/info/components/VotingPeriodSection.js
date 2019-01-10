/* @flow */
import * as React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { translate, Trans } from 'react-i18next';
import { dateFromDT, timeFromDT, DTFromDateAndTime } from 'utils';

import { SettingsSection } from 'components/page';
import VotingPeriodForm from './VotingPeriodForm';
import VotingPeriodValues from './VotingPeriodValues';

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

const buildInitialValues = (elecs: Array<Election>) => {
  const elections = elecs.map(e => ({
    id: e.id,
    name: e.name,
    startDate: dateFromDT(e.start),
    startTime: timeFromDT(e.start),
    endDate: dateFromDT(e.end),
    endTime: timeFromDT(e.end),
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

const buildPayload = values => ({
  elections: values.elections.map(e => ({
    id: e.id,
    start: DTFromDateAndTime(e.startDate, e.startTime),
    end: DTFromDateAndTime(e.endDate, e.endTime),
  })),
  hasMultipleTimes: values.hasMultipleTimes,
});

type Props = {
  children?: ReactChildren,
  active: boolean,
  setActive: Function,
  closeAction: Function,
  submitAction: Function,
  electionGroup: ElectionGroup,
  elections: Election[]
};

class VotingPeriodSection extends React.Component<Props> {
  render() {
    const {
      active,
      setActive,
      submitAction,
      closeAction,
      electionGroup,
    } = this.props;
    const activeElections = electionGroup.elections.filter(e => e.active);

    const activeElement = (
      <Mutation
        mutation={updateVotingPeriods}
        refetchQueries={() => ['electionGroup']}
      >
        {(mutation, { data }) => (
          <VotingPeriodForm
            onSubmit={values => {
              mutation({ variables: buildPayload(values) });
              closeAction();
            }}
            closeAction={closeAction}
            electionType={electionGroup.type}
            initialValues={buildInitialValues(activeElections)}
          />
        )}
      </Mutation>
    );
    
    const inactiveElement = (
      <VotingPeriodValues electionGroup={electionGroup} />
    );

    return (
      <SettingsSection
        header={<Trans>election.votingPeriod</Trans>}
        desc={
          activeElections.length > 0 ? (
            <Trans>election.votingPeriodSubHeader</Trans>
          ) : (
            <Trans>election.noActiveElections</Trans>
          )
        }
        active={active}
        setActive={setActive}
        activeElement={activeElement}
        inactiveElement={inactiveElement}
      />
    );
  }
}

export default VotingPeriodSection;
