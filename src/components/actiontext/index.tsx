import classNames from 'classnames';
import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
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
}));

interface IProps {
  action?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  children?: React.ReactNode;
  bottom?: boolean;
  inline?: boolean;
  onBlur?: any;
  onFocus?: any;
}

const ActionText: React.FunctionComponent<IProps> = (props) => {
  const { children, bottom, action, inline } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
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

export default ActionText;
