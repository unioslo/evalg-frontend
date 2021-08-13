import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
  row: {
    userSelect: 'text',
    height: '5rem',
  },
}));

const TableHeaderRow: React.FunctionComponent<{}> = (props) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return <tr className={classes.row}>{props.children}</tr>;
};

export default TableHeaderRow;
