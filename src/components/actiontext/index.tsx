import classNames from 'classnames';
import React from 'react';
import injectSheet from 'react-jss';

const styles = (theme: any) => ({
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
    verticalAlign: 'inherit',
  },
});

interface IProps {
  action?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  children?: React.ReactNode;
  bottom?: boolean;
  classes: any;
}

const ActionText: React.SFC<IProps> = props => {
  const { classes } = props;
  const cls = classNames({
    [classes.baseline]: props.bottom,
    [classes.actionText]: true,
    'button-no-style': true,
  });
  return (
    <button className={cls} onClick={props.action}>
      {props.children}
    </button>
  );
};

export default injectSheet(styles)(ActionText);
