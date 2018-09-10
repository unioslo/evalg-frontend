/* @flow */
import * as React from 'react';

type Props = {
  children?: React.ChildrenArray<any>
}

export const TableBody = (props: Props) => {
  return (
    <tbody>
      {props.children}
    </tbody>
  )
};

export default TableBody;