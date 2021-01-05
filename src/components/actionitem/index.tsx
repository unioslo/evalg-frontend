import React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

const styles = () => ({
  actionItem: {
    '&:hover': {
      cursor: 'pointer',
    },
    alignItems: 'center',
    display: 'inline-flex',
    height: '100%',
  },
  alignCenter: {
    justifyContent: 'center',
  },
  alignRight: {
    justifyContent: 'flex-end',
  },
});

interface IProps {
  action: () => void;
  alignRight?: boolean;
  alignCenter?: boolean;
  classes: any;
}

const ActionItem: React.FunctionComponent<IProps> = props => {
  const { classes, alignCenter, alignRight, action, children } = props;
  const cls = classNames({
    'button-no-style': true,
    [classes.actionItem]: true,
    [classes.alignCenter]: alignCenter,
    [classes.alignRight]: alignRight,
  });
  return (
    <button
      type="button"
      data-testid="action-item"
      className={cls}
      onClick={action}
    >
      {children}
    </button>
  );
};

export default injectSheet(styles)(ActionItem);
