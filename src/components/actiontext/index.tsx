/* @flow */
import classNames from 'classnames';
import * as React from 'react';
import injectSheet from 'react-jss';

const styles: StyleSheet = (theme) => ({
  actionText: {
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    color: theme.actionTextColor,
    fontSize: '1.6rem',
    verticalAlign: 'super',
  },
  baseline: {
    verticalAlign: 'inherit'
  }
})

interface IProps {
  action?: () => void,
  children?: React.ReactNode,
  bottom?: boolean,
  classes: any
}

const ActionText: React.SFC<IProps> = props => {
  const { classes } = props;
  const cls = classNames({
    [classes.actionText]: true,
    [classes.baseline]: props.bottom
  });
  return (
    <span className={cls}
      onClick={props.action} >
      {props.children}
    </span>
  )
};


export default injectSheet(styles)(ActionText);