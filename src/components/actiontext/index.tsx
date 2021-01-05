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
  inline: {
    color: 'inherit',
    fontSize: 'inherit',
    verticalAlign: 'inherit',
  },
  baseline: {
    verticalAlign: 'inherit',
  },
});

interface IProps {
  action?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  children?: React.ReactNode;
  bottom?: boolean;
  inline?: boolean;
  classes: any;
  onBlur?: any;
  onFocus?: any;
}

const ActionText: React.SFC<IProps> = props => {
  const { children, classes, bottom, action, inline } = props;
  const cls = classNames({
    [classes.baseline]: bottom,
    [classes.actionText]: true,
    [classes.inline]: inline,
    'button-no-style': true,
  });
  return (
    <button className={cls} onClick={action} data-testid="action-text">
      {children}
    </button>
  );
};

export default injectSheet(styles)(ActionText);
