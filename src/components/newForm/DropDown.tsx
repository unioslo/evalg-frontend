import { FieldRenderProps } from 'react-final-form';
import { createUseStyles, useTheme } from 'react-jss';
import Select from 'react-select';

const useStyles = createUseStyles((theme: any) => ({
  label: {
    order: 1,
    fontSize: '2rem',
    lineHeight: 1.45,
    color: theme.formFieldLabelUnfocusedColor,
    transition: 'color 200ms ease-in',
    marginBottom: '2rem',
    display: 'block',
  },
}));

export type SelectOption = {
  label: string;
  value: any;
};

export interface SelectDropDownProps extends FieldRenderProps<string, any> {
  options: Array<SelectOption>;
  classes: any;
  label: any;
  placeholder: any;
  isSearchable?: boolean;
  large?: boolean;
  input: any;
}

export default function DropDown(props: SelectDropDownProps) {
  const { label, options, placeholder, isSearchable, large, input } = props;
  const theme: any = useTheme();
  const classes = useStyles({ theme });

  const searchable = isSearchable ? true : false;
  const size = large ? '35rem' : '22.3rem';

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      '&:hover': {
        cursor: 'pointer',
      },
      width: size,
      height: '4.5rem',
      borderRadius: '0.3rem',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      '&:hover': {
        cursor: 'pointer',
      },
      backgroundColor: state.isFocused
        ? theme.dropDownBackgroundColorFocused
        : '#fff',
      color: theme.dropDownTextColor,
      '&:not(:last-child)': {
        borderBottom: 'solid 1px #ddd;',
      },
    }),
  };

  return (
    <div style={{ width: size }}>
      <label className={classes.label}>{label}</label>
      <Select
        {...input}
        options={options}
        styles={customStyles}
        placeholder={placeholder}
        isSearchable={searchable}
      />
    </div>
  );
}
