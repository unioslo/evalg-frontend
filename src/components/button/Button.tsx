import * as React from 'react';
import classNames from 'classnames';
import Icon from '../icon';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

const OSXUserAgent = window.navigator.userAgent.includes('OS X');

const styles = (theme: any) => ({
  button: {
    '&:only-child, &:last-child': {
      marginRight: 0
    },
    border: `0.3rem solid`,
    borderRadius: '0.4rem',
    cursor: 'pointer',
    display: 'flex',
    fontSize: '2rem',
    height: '6rem',
    lineHeight: 0.9,
    padding: '1.5rem 2rem',
    transition: 'background 100ms ease-in',
    [theme.breakpoints.mdQuery]: {
      fontSize: '1.8rem',
      height: '5rem',
      //padding: '2rem 1.5rem',
    },
  },
  wide: {
    padding: '2rem 1.5rem'
  },
  primary: {
    background: theme.primaryBtnBgColor,
    borderColor: theme.primaryBtnBorderColor,
    color: theme.primaryBtnColor,
  },
  secondary: {
    background: theme.secondaryBtnBgColor,
    borderColor: theme.secondaryBtnBorderColor,
    color: theme.secondaryBtnColor,
  },
  smallText: {
    fontSize: '1.4rem'
  },
  disabled: {
    '&$primary': {
      background: theme.btnDefDisabledColor
    },
    borderColor: theme.btnDefDisabledColor,
    // color: theme.btnDefDisabledTextColor, // this makes secondary button text dissapear when disabled
    cursor: 'not-allowed',
  },
  osx: {
    paddingTop: `calc(${theme.btnVerMdPadding} - ${theme.btnBorderWidth})`
  },
  icon: {
    marginLeft: '2rem',
  },
  iconSmallMargin: {
    marginLeft: '1rem',
  },
});

interface IProps {
  action: (event: any) => void,
  secondary?: boolean,
  disabled?: boolean,
  iconLeft?: string,
  iconRight?: string,
  smallText?: boolean,
  wide?: boolean,
  text: string | any,
  classes: Classes,
}

const Button = (props: IProps) => {
  const { classes } = props;
  const btnClassNames = classNames({
    [classes.button]: true,
    [classes.osx]: OSXUserAgent,
    [classes.disabled]: props.disabled,
    [classes.primary]: !props.secondary,
    [classes.secondary]: props.secondary,
    [classes.smallText]: props.smallText,
    [classes.wide]: props.wide
  });

  return (
    <button onClick={props.action}
      type="button"
      disabled={props.disabled}
      className={btnClassNames}>

      {props.iconLeft &&
        <span className={classes.icon}>
          <Icon type={props.iconLeft} />
        </span>
      }
      {props.text}

      {props.iconRight &&
        <span className={classes.icon}>
          <Icon type={props.iconRight} />
        </span>
      }

    </button>
  )
};

export default injectSheet(styles)(Button);