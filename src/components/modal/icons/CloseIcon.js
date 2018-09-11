/* @flow */
import * as React from 'react';
import injectSheet from 'react-jss';

const styles = theme => ({
  closeIconCircle: {
    fill: theme.closeIconColor
  },
  closeIconLine: {
    fill: theme.colors.white
  }
});

type Props = {
	closeAction: Function,
  classes: Object
}

const CloseIcon = (props: Props) => {
  const {classes} = props;
  return (
    <svg width="19px" height="19px" viewBox="0 0 19 19" onClick={props.closeAction}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" className={classes.closeIconCircle}>
        <circle cx="9.5" cy="9.5" r="9.5"></circle>
        <rect className={classes.closeIconLine} transform="translate(9.500000, 9.500000) rotate(45.000000) translate(-9.500000, -9.500000) " x="8" y="2.5" width="3" height="14" rx="0.8"></rect>
        <rect className={classes.closeIconLine} transform="translate(9.500000, 9.500000) rotate(-45.000000) translate(-9.500000, -9.500000) " x="8" y="2.5" width="3" height="14" rx="0.8"></rect>
      </g>
    </svg>
  )
};

export default injectSheet(styles)(CloseIcon);
