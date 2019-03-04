import * as React from 'react';

interface IProps {
  onChange: (event: any) => void
}

const TableSearchFilter = (props: IProps) => {
  return (
    <input type="text"
           className="table--row--cell--searchfilter"
           onChange={props.onChange}
    />
  )
};

export default TableSearchFilter;