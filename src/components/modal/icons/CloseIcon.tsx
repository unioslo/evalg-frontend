import React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

const styles = (theme: any) => ({
  closeIconCircle: {
    fill: theme.closeIconColor,
  },
  closeIconLine: {
    fill: theme.colors.white,
  },
});

interface IProps {
  closeAction: (a: any) => void;
  classes: Classes;
}

const CloseIcon = (props: IProps) => {
  const { classes } = props;
  return (
    <button className="button-no-style" onClick={props.closeAction}>
      <svg width="19px" height="19px" viewBox="0 0 19 19">
        <g
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
          className={classes.closeIconCircle}
        >
          <circle cx="9.5" cy="9.5" r="9.5" />
          <rect
            className={classes.closeIconLine}
            transform="translate(9.500000, 9.500000) rotate(45.000000) translate(-9.500000, -9.500000) "
            x="8"
            y="2.5"
            width="3"
            height="14"
            rx="0.8"
          />
          <rect
            className={classes.closeIconLine}
            transform="translate(9.500000, 9.500000) rotate(-45.000000) translate(-9.500000, -9.500000) "
            x="8"
            y="2.5"
            width="3"
            height="14"
            rx="0.8"
          />
        </g>
      </svg>
    </button>
  );
};

export default injectSheet(styles)(CloseIcon);
