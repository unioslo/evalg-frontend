import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  row: {
    userSelect: 'text',
    height: '5rem',
  },
});

const TableHeaderRow: React.FunctionComponent<{}> = (props) => {
  const classes = useStyles();
  return <tr className={classes.row}>{props.children}</tr>;
};

export default TableHeaderRow;
