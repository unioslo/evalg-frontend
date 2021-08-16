import React from 'react';
import classNames from 'classnames';
import { createUseStyles } from 'react-jss';

interface IProps {
  children?: React.ReactNode;
  inline?: boolean;
  noTopMargin?: boolean;
  smallBottomMargin?: boolean;
  action?: any;
}

const useStyles = createUseStyles({
  formField: {
    marginRight: '2.5rem',
    verticalAlign: 'top',
    marginTop: '2rem',
    marginBottom: '2rem',
    '&:first-child': {
      marginTop: '0',
    },
  },
  inline: {
    display: 'inline-block',
  },
  noTopMargin: {
    marginTop: '0',
  },
  smallBottomMargin: {
    marginBottom: '2rem',
  },
  hasAction: {
    display: 'flex',
    alignItems: 'center',
  },
  actionField: {
    flexGrow: '1',
    display: 'inline-block',
    marginRight: '2.5rem',
  },
  action: {
    width: '50px',
  },
});

const FormField: React.FunctionComponent<IProps> = (props) => {
  const { action, children, inline, noTopMargin, smallBottomMargin } = props;
  const classes = useStyles();
  const cls = classNames({
    [classes.formField]: true,
    [classes.inline]: inline,
    [classes.noTopMargin]: noTopMargin || inline,
    [classes.smallBottomMargin]: smallBottomMargin,
    [classes.hasAction]: action,
  });
  if (!action) {
    return <div className={cls}>{children}</div>;
  }
  return (
    <div className={cls}>
      <div className={classes.actionField}>{children}</div>
      <div className={classes.action}>{action}</div>
    </div>
  );
};

export default FormField;
