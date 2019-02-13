/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

type Props = {
  children?: React.ChildrenArray<any>,
  smlTopMargin?: boolean,
  noTopMargin?: boolean,
  classes: Object,
};

const styles = theme => ({
  table: {
    width: '100%',
    userSelect: 'none',
    marginTop: '4rem',
    '& th:not(:last-child), & td:not(:last-child)': {
      paddingRight: '2rem',
    },
  },
  smallTopMargin: {
    marginTop: '2rem',
  },
});

const Table = (props: Props) => {
  const { classes } = props;
  const cls = classNames({
    [classes.table]: true,
    [classes.smallTopMargin]: props.smlTopMargin,
  });
  return <table className={cls}>{props.children}</table>;
};

export default injectSheet(styles)(Table);
