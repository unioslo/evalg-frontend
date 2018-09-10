/* @flow */
import * as React from 'react';

type Props = {
  onChange: Function
}

const TableSearchFilter = (props: Props) => {
  return (
    <input type="text"
           className="table--row--cell--searchfilter"
           onChange={props.onChange}
    />
  )
};

export default TableSearchFilter;