import * as React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

interface IProps{
  children?: any,
  classes: Classes,
}

const styles = (theme: any) => ({
  tableHeader: {
    userSelect: 'none',
    background: theme.tableHeaderBg,
    fontSize: theme.tableHeaderFontSize,
    color: theme.tableHeaderTextColor
  }
});

const TableHeader = (props: IProps) => {
  return (
    <thead className={props.classes.tableHeader}>
      {props.children}
    </thead>
  )
};

export default injectSheet(styles as any)(TableHeader);