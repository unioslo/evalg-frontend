import React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

type IProps = {
  children?: React.ReactNode;
  inline?: boolean;
  noTopMargin?: boolean;
  smallBottomMargin?: boolean;
  action?: any;
  classes: Classes;
};

const styles = (theme: any) => ({
  formField: {
    marginRight: '2.5rem',
    verticalAlign: 'top',
    marginTop: '2rem',
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

const FormField = (props: IProps) => {
  const { classes } = props;
  const cls = classNames({
    [classes.formField]: true,
    [classes.inline]: props.inline,
    [classes.noTopMargin]: props.noTopMargin || props.inline,
    [classes.smallBottomMargin]: props.smallBottomMargin,
    [classes.hasAction]: props.action,
  });
  if (!props.action) {
    return <div className={cls}>{props.children}</div>;
  }
  return (
    <div className={cls}>
      <div className={classes.actionField}>{props.children}</div>
      <div className={classes.action}>{props.action}</div>
    </div>
  );
};

export default injectSheet(styles)(FormField);
