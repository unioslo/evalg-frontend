/* @flow */
import * as React from 'react';
import injectSheet from 'react-jss';

type Props = {
  children?: React.ChildrenArray<any>,
  classes: Object
}

const styles = theme => ({
  row: {
    userSelect: 'none',
    height: '5rem'
  }
});

const TableHeaderRow = (props: Props) => {
  return (
    <tr className={props.classes.row}>
      {props.children}
    </tr>
  )
};

export default injectSheet(styles)(TableHeaderRow);