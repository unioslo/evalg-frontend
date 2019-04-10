import * as React from 'react';
import injectSheet from 'react-jss';
import { FieldRenderProps } from 'react-final-form';
import Select from 'react-select';
import theme from '../../theme';

const styles = (theme: any) => ({
  label: {
    order: 1,
    fontSize: '2rem',
    lineHeight: 1.45,
    color: theme.formFieldLabelUnfocusedColor,
    transition: 'color 200ms ease-in',
    marginBottom: '2rem',
    display: 'block',
  },
});

const bluishLenkefarge = '#2294a8';
const greyishBrown = '#555555';
const lightBlueGrey = '#c4e2e7';

interface IProps extends FieldRenderProps {
  options: any;
  classes: any;
  label: any;
  placeholder: any;
  isSearchable?: boolean;
  large?: boolean;
}

class SelectDropDown extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
  }

  public onInputChange(value: string) {
    this.setState({ inputValue: value });
  }

  public render() {
    const { classes, label, options, placeholder, isSearchable, large} = this.props;

    const searchable = isSearchable ? true : false;
    const size = large ? '35rem': '22.3rem';

    const customStyles = {
      option: (provided: any, state: any) => ({
        ...provided,
        '&:hover': {
          backgroundColor: lightBlueGrey,
          cursor: 'pointer',
        },
        backgroundColor: state.isFocused ? theme.dropDownBackgroundColorFocused : '#fff',
        color: greyishBrown,
        '&:not(:last-child)': {
          borderBottom: 'solid 1px #ddd;',
        },
      }),
      control: (provided: any, state: any) => ({
        ...provided,
        boxShadow: state.isFocused ? '0 0 0 1px ' + bluishLenkefarge : '',
        borderColor: state.isFocused ? bluishLenkefarge : provided.borderColor,
        '&:hover': {
          borderColor: bluishLenkefarge,
          cursor: 'pointer',
        },
        width: size,
        height: '4.5rem',
        borderRadius: '0.3rem',
        color: greyishBrown,
      }),
      dropdownIndicator: (provided: any, state: any) => ({
        ...provided,
        '&:hover': {
          color: bluishLenkefarge,
        },
        color: bluishLenkefarge,
      }),
    };

    return (
      <div>
        <label className={classes.label}>{label}</label>
        <Select
          {...this.props.input}
          options={options}
          styles={customStyles}
          placeholder={placeholder}
          isSearchable={searchable}
        />
      </div>
    );
  }
}

const StyledDropDown = injectSheet(styles)(SelectDropDown);
export { StyledDropDown as SelectDropDown };