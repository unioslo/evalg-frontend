import * as React from 'react';
import classNames from 'classnames';
import Icon from '../icon';
import injectSheet from 'react-jss';

type Props = {
  action: Function,
  secondary?: boolean,
  disabled?: boolean,
  iconLeft?: string,
  iconRight?: string,
  wide?: boolean,
  text: string | ReactElement,
  classes: Object
}

const OSXUserAgent = window.navigator.userAgent.includes('OS X');

const styles = theme => ({
  button: {
    '&:only-child, &:last-child': {
      marginRight: 0
    },
    border: `0.3rem solid`,
    borderRadius: '0.4rem',
    cursor: 'pointer',
    display: 'flex',
    fontSize: '2rem',
    //height: '6rem',
    lineHeight: 1.1,
    padding: '1.9rem 4rem',
    transition: 'background 100ms ease-in',
    [`media (min-width: ${theme.breakpoints.lg})`]: {
      fontSize: '1.8rem',
      height: '5rem',
      padding: '2rem 1.5rem',
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
  disabled: {
    '&$primary': {
      background: theme.btnDefDisabledColor
    },
    borderColor: theme.btnDefDisabledColor,
    color: theme.btnDefDisabledTextColor,
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

const Button = (props: Props) => {
  const { classes } = props;
  const btnClassNames = classNames({
    [classes.button]: true,
    [classes.osx]: OSXUserAgent,
    [classes.disabled]: props.disabled,
    [classes.primary]: !props.secondary,
    [classes.secondary]: props.secondary,
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