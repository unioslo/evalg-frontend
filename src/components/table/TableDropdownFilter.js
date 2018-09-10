/* @flow */
import * as React from 'react';
import injectSheet from 'react-jss';

type Props = {
  onChange: Function,
  value: string,
  options: Array<DropdownOption>,
  classes: Object
}

const styles = theme => ({
  dropdownFilter: {
    //@include table-filter-box();
    '-moz-appearance': 'none',
    '-webkit-appearance': 'none',
    background: 'icon(dropdownarrow, $darkTurquoise, 14, 9) right 1rem center no-repeat'
  },
});

const TableFilterBoxDropdown = (props: Props) => {
  return (
    <select value={props.value}
            className={props.classes.dropdownFilter}
            onChange={props.onChange}>
      {props.options.map((option, index) =>
        <option value={option.value}
                key={index.toString()}>
          {option.name}
        </option>
      )}
    </select>
  )
};

export default injectSheet(styles)(TableFilterBoxDropdown);