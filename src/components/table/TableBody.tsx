/* @flow */
import * as React from 'react';

interface IProps {
  // children?: React.ChildrenArray<any>
  children?: any,
}

export const TableBody = (props: IProps) => {
  return (
    <tbody>
      {props.children}
    </tbody>
  )
};

export default TableBody;