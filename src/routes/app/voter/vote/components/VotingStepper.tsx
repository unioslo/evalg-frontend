import React from 'react';
import { Trans, translate, TranslationFunction } from 'react-i18next';

import { Stepper, StepperSection } from '../../../../../components/stepper';
import { ScreenSizeConsumer } from '../../../../../providers/ScreenSize';
import MobileStepper from '../../../../../components/stepper/MobileStepper';

export enum VotingStep {
  Step1FillOutBallot = 1,
  Step2ReviewBallot,
  Step3Receipt,
}

interface IProps {
  currentStep: VotingStep;
  isStep1Clickable: boolean;
  onClickStep1: () => void;
  t: TranslationFunction;
}

const VotingStepper: React.SFC<IProps> = ({
  currentStep,
  isStep1Clickable,
  onClickStep1,
  t,
}) => {
  const desktopVotingStepper = (
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

  let currentStepText;
  switch (currentStep) {
    case VotingStep.Step1FillOutBallot:
      currentStepText = t('voter.stepperStep1');
      break;
    case VotingStep.Step2ReviewBallot:
      currentStepText = t('voter.stepperStep2');
      break;
    case VotingStep.Step3Receipt:
      currentStepText = t('voter.stepperStep3');
      break;
  }

  const mobileVotingStepper = (
    <MobileStepper
      numberOfSteps={3}
      currentStepNumber={currentStep}
      stepText={currentStepText}
      // nextStepsToTheRight
    />
  );

  return (
    <ScreenSizeConsumer>
      {({ screenSize }) =>
        screenSize === 'md' || screenSize === 'lg'
          ? desktopVotingStepper
          : mobileVotingStepper
      }
    </ScreenSizeConsumer>
  );
};

export default translate()(VotingStepper);
