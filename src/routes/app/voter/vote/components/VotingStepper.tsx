import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { appMobileVotingStepperVariant } from 'appConfig';
import { Stepper, StepperItem } from 'components/stepper';
import MobileStepperCircles from 'components/stepper/MobileStepperCircles';
import MobileStepperSimple from 'components/stepper/MobileStepperSimple';
import { ScreenSizeConsumer } from 'providers/ScreenSize';

export enum VotingStep {
  Step1SelectVoterGroup = 1,
  Step2FillBallot = 2,
  Step3ReviewBallot = 3,
  Step4Receipt = 4,
}

interface IProps extends WithTranslation {
  currentStep: VotingStep;
  currentStepText: string;
  onClickStep1?: () => void;
  onClickStep2?: () => void;
  scrollToDivRef?: React.RefObject<HTMLDivElement>;
  disabled?: boolean;
}

const VotingStepper: React.SFC<IProps> = ({
  currentStep,
  currentStepText,
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
