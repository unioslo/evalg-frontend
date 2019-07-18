import React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

const styles = (theme: any) => ({
  mobileStepperSimple: {
    width: '100%',
    marginBottom: '2rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    '& svg': {
      width: '100%',
      height: 56,
    },
  },
  mainRectangle: {
    fill: theme.stepperColor,
    width: '100%',
  },
  sectionNumber: {
    fontSize: '2.4rem',
    fontWeight: 'bold',
  },
  rightCirclesSvg: {
    overflow: 'visible',
  },
  stepText: {
    fontSize: '1.8rem',
  },
  sectionNumberActive: {
    fill: theme.stepperItemNumberColorActive,
  },
  sectionNumberInactive: {
    fill: theme.stepperItemNumberColorInactive,
  },
  sectionCircleActive: {
    fill: theme.stepperItemCircleColorActive,
  },
  sectionCircleInactive: {
    fill: theme.stepperItemCircleColorInactive,
  },
});

interface IProps {
  currentStepNumber: number;
  numberOfSteps: number;
  stepText: string;
  nextStepsToTheRight?: boolean;
  title?: string;
  classes: Classes;
}

const MobileStepperSimple: React.SFC<IProps> = props => {
  const { currentStepNumber, numberOfSteps, stepText, title, classes } = props;

  const numbersRectXOffset = 4;
  const numbersRectWidth = 80;
  const numbersXPos = 22;
  const stepTextLeftPad = 15;

  return (
    <div className={classes.mobileStepperSimple}>
      <svg>
        {title && <title>{title}</title>}
        <rect
          className={classes.mainRectangle}
          x="0"
          y="0"
          height="56"
          width="100%"
          rx="28"
        />

        <rect
          className={classes.sectionCircleActive}
          x={numbersRectXOffset}
          y="3"
          height="50"
          width={numbersRectWidth}
          rx="25"
        />
        <text
          className={classes.sectionNumber + ' ' + classes.sectionNumberActive}
        >
          <tspan x={numbersXPos} y="37">
            {currentStepNumber} / {numberOfSteps}
          </tspan>
        </text>

        <text className={classes.stepText}>
          <tspan
            x={numbersRectXOffset + numbersRectWidth + stepTextLeftPad}
            y="35"
          >
            {stepText}
          </tspan>
        </text>
      </svg>
    </div>
  );
};

export default injectSheet(styles)(MobileStepperSimple);
