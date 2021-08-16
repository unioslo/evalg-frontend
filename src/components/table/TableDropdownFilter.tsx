import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
interface IProps {
  onChange: (event: any) => void;
  value: string;
  options: any[];
}

const useStyles = createUseStyles((theme: any) => ({
  dropdownFilter: {
    //@include table-filter-box();
    '-moz-appearance': 'none',
    '-webkit-appearance': 'none',
    background:
      'icon(dropdownarrow, $darkTurquoise, 14, 9) right 1rem center no-repeat',
  },
}));

const TableFilterBoxDropdown: React.FunctionComponent<IProps> = (props) => {
  const { onChange, value, options } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <select
      value={value}
      className={classes.dropdownFilter}
      onChange={onChange}
    >
      {options.map((option, index) => (
        <option value={option.value} key={index.toString()}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default TableFilterBoxDropdown;
