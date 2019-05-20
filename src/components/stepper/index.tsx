import React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

const styles = (theme: any) => ({
  stepper: {
    display: 'flex',
    justifyContent: 'center',
  },
  rectangle: {
    fill: theme.stepperColor,
  },
  sectionNumber: {
    fontSize: '2.4rem',
    fontWeight: 'bold',
  },
  sectionNumberActive: {
    fill: theme.stepperSectionTextColorActive,
  },
  sectionNumberInactive: {
    fill: theme.stepperSectionTextColorInactive,
  },
  sectionCircleActive: {
    fill: theme.stepperSectionCircleColorActive,
  },
  sectionCircleInactive: {
    fill: theme.stepperSectionCircleColorInactive,
  },
  clickable: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
});

interface IStepperItemProps {
  translateX: number;
  translateY: number;
  number: number;
  itemText: string;
  itemTextLeftPadding?: number;
  active: boolean;
  clickable?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  classes: Classes;
}

const StepperItem: React.SFC<IStepperItemProps> = props => {
  const {
    translateX,
    translateY,
    number,
    itemText,
    itemTextLeftPadding,
    active,
    clickable,
    disabled,
    onClick,
    classes,
  } = props;

  const handleClick = () => {
    if (clickable && !disabled && onClick) {
      onClick();
    }
  };

  const gClassNames = classNames({
    [classes.clickable]: clickable,
  });
  const numberClassNames = classNames({
    [classes.sectionNumber]: true,
    [classes.sectionNumberActive]: active,
    [classes.sectionNumberInactive]: !active,
  });
  const circleClassNames = classNames({
    [classes.sectionCircleActive]: active,
    [classes.sectionCircleInactive]: !active,
  });

  const circleRadius = 50;
  const itemTextLeftPad = itemTextLeftPadding ? itemTextLeftPadding : 15;

  return (
    <g
      className={gClassNames}
      onClick={handleClick}
      transform={'translate(' + translateX + ', ' + translateY + ')'}
      opacity={disabled ? 0.75 : 'inherit'}
    >
      <text style={{ fontStyle: disabled ? 'italic' : 'inherit' }}>
        <tspan x={circleRadius + itemTextLeftPad} y="31">
          {itemText}
        </tspan>
      </text>
      <circle className={circleClassNames} cx="25" cy="25" r="25" />
      <text className={numberClassNames}>
        <tspan x="18" y="34">
          {number}
        </tspan>
      </text>
    </g>
  );
};

interface IProps {
  title?: string;
  classes: Classes;
}

const Stepper: React.SFC<IProps> = props => {
  const { title, classes } = props;
  return (
    <div className={classes.stepper}>
      <svg width="897px" height="56px" viewBox="0 0 897 56">
        {title && <title>{title}</title>}
        <rect
          className={classes.rectangle}
          x="0"
          y="0"
          width="897"
          height="56"
          rx="28"
        />
        {props.children}
      </svg>
    </div>
  );
};

const StyledStepperItem = injectSheet(styles)(StepperItem);
const StyledStepper = injectSheet(styles)(Stepper);

export { StyledStepperItem as StepperItem, StyledStepper as Stepper };
