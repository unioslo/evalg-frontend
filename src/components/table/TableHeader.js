/* @flow */
import * as React from 'react';
import injectSheet from 'react-jss';

type Props = {
  children?: React.ChildrenArray<any>,
  classes: Object
}

const styles = theme => ({
  tableHeader: {
    userSelect: 'none',
    background: theme.tableHeaderBg,
    fontSize: theme.tableHeaderFontSize,
    color: theme.tableHeaderTextColor
  }
});

const TableHeader = (props: Props) => {
  return (
    <thead className={props.classes.tableHeader}>
      {props.children}
    </thead>
  )
};

export default injectSheet(styles)(TableHeader);