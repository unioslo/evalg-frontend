import * as React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

interface IProps {
  children?: any,
  classes: Classes,
}

const styles = (theme: any) => ({
  row: {
    userSelect: 'none',
    height: '5rem'
  }
});

const TableHeaderRow = (props: IProps) => {
  return (
    <tr className={props.classes.row}>
      {props.children}
    </tr>
  )
};

export default injectSheet(styles as any)(TableHeaderRow);