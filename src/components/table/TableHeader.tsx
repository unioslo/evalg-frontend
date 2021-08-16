import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
  tableHeader: {
    userSelect: 'text',
    background: theme.tableHeaderBg,
    fontSize: theme.tableHeaderFontSize,
    color: theme.tableHeaderTextColor,
  },
}));

const TableHeader: React.FunctionComponent<{}> = (props) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return <thead className={classes.tableHeader}>{props.children}</thead>;
};

export default TableHeader;
