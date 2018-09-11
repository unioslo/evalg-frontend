/* @flow */
import * as React from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

import { Trans } from 'react-i18next';
import VoterInfoForm from './VoterInfoForm';
import VoterInfoValues from './VoterInfoValues';
import { dateFromDT, timeFromDT, DTFromDateAndTime } from 'utils';

const buildInitialValues = (elecs: Array<Election>) => {
  const elections = elecs.map(e => ({
    id: e.id,
    name: e.name,
    mandatePeriodStart: e.mandatePeriodStart,
    mandatePeriodEnd: e.mandatePeriodEnd,
    contact: e.contact,
    informationUrl: e.informationUrl
  }));
  let hasMultipleMandateTimes = false;
  if (elecs.length > 1) {
    for (let i = 0; i < elecs.length - 1; i++) {
      if (elecs[i].mandatePeriodStart !== elecs[i + 1].mandatePeriodStart ||
        elecs[i].mandatePeriodEnd !== elecs[i + 1].mandatePeriodEnd) {
        hasMultipleMandateTimes = true;
        break;
      }
    }
  }
  let hasMultipleContactInfo = false;
  if (elecs.length > 1) {
    for (let i = 0; i < elecs.length - 1; i++) {
      if (elecs[i].contact !== elecs[i + 1].contact) {
        hasMultipleContactInfo = true;
        break;
      }
    }
  }
  let hasMultipleInfoUrls = false;
  if (elecs.length > 1) {
    for (let i = 0; i < elecs.length - 1; i++) {
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
    hasMultipleInfoUrls
  };
}

const buildPayload = (values) => {
  const {
    hasMultipleContactInfo,
    hasMultipleInfoUrls,
    hasMultipleMandateTimes,
    elections
  } = values;
  return ({
    ...values,
    elections: elections.map(e => ({
      id: e.id,
      mandatePeriodStart: hasMultipleMandateTimes ?
        e.mandatePeriodStart :
        elections[0].mandatePeriodStart,
      mandatePeriodEnd: hasMultipleMandateTimes ?
        e.mandatePeriodEnd :
        elections[0].mandatePeriodEnd,
      contact: hasMultipleContactInfo ?
        e.contact :
        elections[0].contact,
      informationUrl: hasMultipleInfoUrls ?
        e.informationUrl :
        elections[0].informationUrl
    })),
  })
};

const updateVoterInfo = gql`
  mutation UpdateVoterInfo($elections: [ElectionVoterInfoInput]!) {
    updateVoterInfo(elections: $elections) {
      ok
    }
  }
`;

type Props = {
  children?: ReactChildren,
  active: boolean,
  setActive: Function,
  closeAction: Function,
  submitAction: Function,
  electionGroup: ElectionGroup,
  elections: Array<Election>
};

class VoterInfoSection extends React.Component<Props> {
  render() {
    const {
      active, setActive, submitAction, closeAction, electionGroup, elections
    } = this.props;
    if (active) {
      return (
        <Mutation
          mutation={updateVoterInfo}
          refetchQueries={() => ['electionGroup']}>
          {(mutation, { data }) => (
            <VoterInfoForm
              handleSubmit={(values) => {
                mutation({ variables: buildPayload(values) });
                closeAction();
              }}
              closeAction={closeAction}
              electionGroup={electionGroup}
              initialValues={buildInitialValues(elections)}
              header={<Trans>election.voterInfo</Trans>}
            />
          )}
        </Mutation>
      )
    }
    return (
      <VoterInfoValues
        electionGroup={electionGroup}
        elections={elections}
        header={<Trans>election.voterInfo</Trans>}
        active={active}
        setActive={setActive}
      />
    )
  }
}

export default VoterInfoSection;