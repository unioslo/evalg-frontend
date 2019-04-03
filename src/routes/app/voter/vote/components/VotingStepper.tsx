import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { appMobileVotingStepperVariant } from './../../../../../appConfig';
import { Stepper, StepperItem } from '../../../../../components/stepper';
import MobileStepperCircles from '../../../../../components/stepper/MobileStepperCircles';
import { ScreenSizeConsumer } from '../../../../../providers/ScreenSize';
import MobileStepperSimple from '../../../../../components/stepper/MobileStepperSimple';

export enum VotingStep {
  Step1SelectVoterGroup = 1,
  Step2FillBallot,
  Step3ReviewBallot,
  Step4Receipt,
}

interface IProps extends WithTranslation {
  currentStep: VotingStep;
  onClickStep1?: () => void;
  onClickStep2?: () => void;
  scrollToDivRef?: React.RefObject<HTMLDivElement>;
  disabled?: boolean;
}

const VotingStepper: React.SFC<IProps> = ({
  currentStep,
  onClickStep1,
  onClickStep2,
  scrollToDivRef,
  disabled,
  i18n,
  t,
}) => {
  const lang = i18n.language || 'nb';

  const isStepperStep1Clickable =
    currentStep === VotingStep.Step2FillBallot ||
    currentStep === VotingStep.Step3ReviewBallot;
  const isStepperStep2Clickable = currentStep === VotingStep.Step3ReviewBallot;
  const isSteps1To3Disabled =
    currentStep === VotingStep.Step4Receipt || disabled;

  const stepperItemsProps = [
    {
      translateX: 4,
      onClick: onClickStep1,
      isClickable: isStepperStep1Clickable,
      isDisabled: isSteps1To3Disabled,
    },
    {
      translateX: lang === 'nb' ? 188 : 230,
      onClick: onClickStep2,
      isClickable: isStepperStep2Clickable,
      isDisabled: isSteps1To3Disabled,
    },
    {
      translateX: lang === 'nb' ? 444 : 464,
      isDisabled: isSteps1To3Disabled,
    },
    {
      translateX: lang === 'nb' ? 710 : 700,
    },
  ];

  const desktopVotingStepper = (
    <Stepper>
      {stepperItemsProps.map((stepperItemProps, index) => (
        <StepperItem
          key={index}
          translateX={stepperItemProps.translateX}
          translateY={3}
          number={index + 1}
          itemText={t(`voter.stepperStep${index + 1}`)}
          itemTextLeftPadding={12}
          active={currentStep === index + 1}
          clickable={stepperItemProps.isClickable}
          disabled={stepperItemProps.isDisabled}
          onClick={stepperItemProps.onClick}
        />
      ))}
    </Stepper>
  );

  let currentStepText;
  switch (currentStep) {
    case VotingStep.Step1SelectVoterGroup:
      currentStepText = t('voter.stepperStep1');
      break;
    case VotingStep.Step2FillBallot:
      currentStepText = t('voter.stepperStep2');
      break;
    case VotingStep.Step3ReviewBallot:
      currentStepText = t('voter.stepperStep3');
      break;
    case VotingStep.Step4Receipt:
      currentStepText = t('voter.stepperStep4');
      break;
    default:
      currentStepText = '';
  }

  let mobileVotingStepper: React.ReactNode;
  switch (appMobileVotingStepperVariant) {
    case 'circles':
      mobileVotingStepper = (
        <MobileStepperCircles
          numberOfSteps={4}
          currentStepNumber={currentStep}
          stepText={currentStepText}
        />
      );
      break;
    case 'simple':
      mobileVotingStepper = (
        <MobileStepperSimple
          numberOfSteps={4}
          currentStepNumber={currentStep}
          stepText={currentStepText}
        />
      );
      break;
  }

  return (
    <>
      <div ref={scrollToDivRef} style={{ height: '1rem' }} />
      <ScreenSizeConsumer>
        {({ screenSize }) =>
          screenSize === 'md' || screenSize === 'lg'
            ? desktopVotingStepper
            : mobileVotingStepper
        }
      </ScreenSizeConsumer>
    </>
  );
};

export default withTranslation()(VotingStepper);
