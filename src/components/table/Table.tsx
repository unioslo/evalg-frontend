/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

interface IProps {
  children?: React.ReactNode,
  marginTop?: string,
  classes: Classes,
};

const styles = (theme: any) => ({
  table: {
    width: '100%',
    userSelect: 'none',
    marginTop: (props: IProps) => props.marginTop ? props.marginTop : '4rem',
    '& th:not(:last-child), & td:not(:last-child)': {
      paddingRight: '2rem',
    },
  },
});

const Table = (props: IProps) => {
  const { classes } = props;
  const cls = classNames({
    [classes.table]: true,
  });
  return <table className={cls}>{props.children}</table>;
};

export default injectSheet(styles)(Table);
