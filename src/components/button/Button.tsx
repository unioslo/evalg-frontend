import React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import Icon from 'components/icon';
import Spinner from 'components/animations/Spinner';

const OSXUserAgent = window.navigator.userAgent.includes('OS X');

const styles = (theme: any) => ({
  button: {
    '&:only-child, &:last-child': {
      marginRight: 0,
    },
    border: `0.3rem solid`,
    borderRadius: '0.4rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '2rem',
    height: (props: IProps) => (props.height ? props.height : '6rem'),
    lineHeight: 0.9,
    padding: '0 2rem',
    transition: 'background 100ms ease-in',
    [theme.breakpoints.mdQuery]: {
      fontSize: '1.8rem',
      height: (props: IProps) => (props.height ? props.height : '5rem'),
    },
    '&:focus': {
      outlineOffset: '4px',
    },
  },
  wide: {
    padding: '2rem 1.5rem',
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
    fontSize: '1.4rem',
  },
  disabled: {
    '&$primary': {
      background: theme.btnDefDisabledColor,
    },
    '&$secondary': {
      color: theme.btnDefDisabledColor,
    },
    borderColor: theme.btnDefDisabledColor,
    cursor: 'not-allowed',
  },
  osx: {
    paddingTop: `calc(${theme.btnVerMdPadding} - ${theme.btnBorderWidth})`,
  },
  icon: {
    marginLeft: '2rem',
  },
  iconSmallMargin: {
    marginLeft: '1rem',
  },
  fillWidth: {
    flex: '1 0 auto',
  },
  centerContent: {
    justifyContent: 'center',
  },
});

interface IProps {
  action?: (event: any) => void;
  secondary?: boolean;
  disabled?: boolean;
  showSpinner?: boolean;
  iconLeft?: string;
  iconRight?: string;
  smallText?: boolean;
  type?: 'button' | 'reset' | 'submit' | undefined;
  wide?: boolean;
  fillWidth?: boolean;
  centerContent?: boolean;
  height?: string;
  text: string | any;
  classes: Classes;
}

const Button: React.FunctionComponent<IProps> = (props) => {
  const {
    action,
    centerContent,
    classes,
    disabled,
    fillWidth,
    iconLeft,
    iconRight,
    secondary,
    showSpinner,
    smallText,
    text,
    type,
    wide,
  } = props;

  const btnClassNames = classNames({
    [classes.button]: true,
    [classes.osx]: OSXUserAgent,
    [classes.disabled]: disabled,
    [classes.primary]: !secondary,
    [classes.secondary]: secondary,
    [classes.smallText]: smallText,
    [classes.wide]: wide,
    [classes.fillWidth]: fillWidth,
    [classes.centerContent]: centerContent,
  });

  return (
    <button
      onClick={action}
      type={type ? type : 'button'}
      disabled={disabled}
      className={btnClassNames}
    >
      {iconLeft && (
        <span className={classes.icon}>
          <Icon type={iconLeft} />
        </span>
      )}
      {text}

      {iconRight && (
        <span className={classes.icon}>
          <Icon type={iconRight} />
        </span>
      )}

      {showSpinner && <Spinner marginLeft="1rem" size="2.3rem" />}
    </button>
  );
};

export default injectSheet(styles)(Button);
