import React from 'react';
import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
  mobileStepperCircles: {
    width: '100%',
    marginBottom: '2rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    '& svg': {
      width: '100%',
      height: 56,
    },
  },
  rectangle: {
    fill: theme.stepperColor,
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
    '@media (max-width:355px)': {
      fontSize: '1.5rem',
    },
  },
  stepTextSmall: {
    fontSize: '1.5rem',
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
    stroke: theme.stepperItemNumberColorInactive,
    strokeWidth: 1,
    r: 24.5,
  },
}));

interface IProps {
  numberOfSteps: number;
  currentStepNumber: number;
  stepText: string;
  title?: string;
}

const MobileStepperCircles: React.FunctionComponent<IProps> = (props) => {
  const { numberOfSteps, currentStepNumber, stepText, title } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });

  let stepNumbers = [];
  for (let i = 1; i <= numberOfSteps; i += 1) {
    stepNumbers.push(i);
  }
  const leftStepNumbers = stepNumbers.slice(0, currentStepNumber);
  const rightStepNumbers = stepNumbers.slice(
    currentStepNumber,
    stepNumbers.length
  );

  const topPadding = 3;
  const firstCircleXOffset = 4;
  const circleRadius = 25;
  const circleDiameter = 50;
  const nextCircleXOffset = 15;
  const numberXPos = 18;
  const stepTextLeftPad = 12;

  const stepTextXOffset =
    firstCircleXOffset +
    circleDiameter +
    nextCircleXOffset * (currentStepNumber - 1) +
    stepTextLeftPad;

  return (
    <div className={classes.mobileStepperCircles}>
      <svg>
        {title && <title>{title}</title>}
        <rect
          className={classes.rectangle}
          x="0"
          y="0"
          height="56"
          width="100%"
          rx="28"
        />
        {leftStepNumbers.map((stepNumber, index) => {
          const circleXOffset =
            firstCircleXOffset + circleRadius + nextCircleXOffset * index;

          const numberXOffset =
            firstCircleXOffset + numberXPos + nextCircleXOffset * index;

          const numberClassNames = classNames({
            [classes.sectionNumber]: true,
            [classes.sectionNumberActive]: stepNumber === currentStepNumber,
            [classes.sectionNumberInactive]: stepNumber !== currentStepNumber,
          });

          return (
            <React.Fragment key={index}>
              <circle
                className={
                  stepNumber === currentStepNumber
                    ? classes.sectionCircleActive
                    : classes.sectionCircleInactive
                }
                cx={circleXOffset}
                cy={topPadding + circleRadius}
                r={circleRadius}
              />
              <text className={numberClassNames}>
                <tspan x={numberXOffset} y="37">
                  {stepNumber}
                </tspan>
              </text>
            </React.Fragment>
          );
        })}

        <svg className={classes.rightCirclesSvg} x="100%" y={topPadding}>
          {rightStepNumbers.map((stepNumber, index) => {
            const circleXNegativeOffset =
              firstCircleXOffset +
              circleRadius +
              nextCircleXOffset * (rightStepNumbers.length - 1 - index);

            const numberXNegativeOffset =
              firstCircleXOffset +
              (circleDiameter - numberXPos) +
              nextCircleXOffset * (rightStepNumbers.length - 1 - index);

            const numberClassNames = classNames({
              [classes.sectionNumber]: true,
              [classes.sectionNumberInactive]: true,
            });

            return (
              <React.Fragment key={index}>
                <circle
                  className={classes.sectionCircleInactive}
                  cx={-circleXNegativeOffset}
                  cy={circleRadius}
                  r={circleRadius}
                />
                <text className={numberClassNames}>
                  <tspan x={-numberXNegativeOffset} y="34">
                    {stepNumber}
                  </tspan>
                </text>
              </React.Fragment>
            );
          })}
        </svg>

        <text className={classes.stepText}>
          <tspan x={stepTextXOffset} y="35">
            {stepText}
          </tspan>
        </text>
      </svg>
    </div>
  );
};

export default MobileStepperCircles;
