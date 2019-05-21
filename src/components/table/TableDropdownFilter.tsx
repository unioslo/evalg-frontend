import React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

interface IProps {
  onChange: (event: any) => void;
  value: string;
  options: any[];
  classes: Classes;
}

const styles = (theme: any) => ({
  dropdownFilter: {
    //@include table-filter-box();
    '-moz-appearance': 'none',
    '-webkit-appearance': 'none',
    background:
      'icon(dropdownarrow, $darkTurquoise, 14, 9) right 1rem center no-repeat',
  },
});

const TableFilterBoxDropdown = (props: IProps) => {
  return (
    <select
      value={props.value}
      className={props.classes.dropdownFilter}
      onChange={props.onChange}
    >
      {props.options.map((option, index) => (
        <option value={option.value} key={index.toString()}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default injectSheet(styles)(TableFilterBoxDropdown);
