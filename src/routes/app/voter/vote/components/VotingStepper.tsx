import React from 'react';
import { Trans, translate } from 'react-i18next';

import { Stepper, StepperSection } from '../../../../../components/stepper';

export enum VotingStep {
  Step1FillOutBallot,
  Step2ReviewBallot,
  Step3Receipt,
}

interface IProps {
  currentStep: VotingStep;
  isStep1Clickable: boolean;
  onClickStep1: () => void;
}

const VotingStepper: React.SFC<IProps> = ({
  currentStep,
  isStep1Clickable,
  onClickStep1,
}) => (
  <Stepper>
    <StepperSection
      translateX="4"
      translateY="3"
      number="1"
      desc={<Trans>voter.stepperStep1</Trans>}
      active={currentStep === VotingStep.Step1FillOutBallot}
      clickable={isStep1Clickable}
      onClick={onClickStep1}
    />
    <StepperSection
      translateX="337"
      translateY="3"
      number="2"
      desc={<Trans>voter.stepperStep2</Trans>}
      active={currentStep === VotingStep.Step2ReviewBallot}
    />
    <StepperSection
      translateX="670"
      translateY="3"
      number="3"
      desc={<Trans>voter.stepperStep3</Trans>}
      active={currentStep === VotingStep.Step3Receipt}
    />
  </Stepper>
);

export default translate()(VotingStepper);
