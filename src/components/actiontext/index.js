/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

const styles = theme => ({
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

type Props = {
  action?: Function,
  children?: React$Element<any>,
  bottom?: boolean,
  classes: Object
}

const ActionText = (props: Props) => {
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