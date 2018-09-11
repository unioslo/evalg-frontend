/* @flow */
import * as React from 'react';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import classNames from 'classnames';
import injectSheet from 'react-jss';

import DropDownBase from 'components/baseComponents/DropDownBase';
import TextInput from './TextInput';
import { FieldRenderProps } from 'react-final-form';

type DropDownOption = {
  name: string,
  value: any
}

const getValueName = (value: any, options: Array<DropDownOption>): string => {
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === value) {
      return options[i].name;
    }
  }
  return '';
};


type Props = {
  options: Array<Object>,
  placeholder: string,
  value: number,
  onBlur: Function,
  onChange: Function,
  label: ReactElement,
  searchable?: boolean,
  large?: boolean,
  name: string,
  meta: Object,
  classes: Object
}

const styles = theme => ({
  dropdown: {
    position: 'relative',
    width: theme.dropDownWidth,
    fontSize: theme.formFieldFontSize,
    color: theme.formFieldTextColor,
    background: theme.white,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  large: {
    width: theme.dropDownWidthLarge
  },
  list: {
    position: 'absolute',
    top: '9.6rem',
    borderRadius: theme.formFieldBorderRadius,
    listStyleType: 'none',
    minWidth: theme.dropDownWidth,
    maxHeight: theme.dropDownListMaxHeight,
    zIndex: 100,
    background: theme.colors.white,
    border: theme.formFieldBorder,
    borderColor: theme.formFieldBorderColor,
  },
  listNoLabel: {
    top: '4.6rem',
  },
  listScroll: {
    overflowY: 'scroll'
  },
  listLarge: {
    width: theme.dropDownWidthLarge
  },
  listItem: {
    borderBottom: `0.1rem solid ${theme.formFieldBorderColor}`,
    padding: `0.7rem ${theme.formFieldHorizontalPadding}`,
    minHeight: '3rem',
    '&:hover': {
      background: theme.lightBlueGray,
      cursor: 'pointer'
    },
    '&:last-child': {
      borderBottom: 0
    }
  },
  input: {
    background: 'url("dropdownarrow.svg") no-repeat right 13px top 50%',
    backgroundSize: '14px 9px'
  }
})

class DropDown extends DropDownBase {
  state: DropDownState;

  componentDidMount() {
    if (this.props.searchable && this.props.value !== "") {
      this.setState({
        inputValue: this.props.options[this.props.value].name
      });
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.value === '') {
      this.setState({ inputValue: '' })
    }
  }

  handleOnBlur() {
    // Redux-form's onBlur will also generate a change event
    if (this.props.onBlur) {
      this.props.onBlur(this.props.value);
    }
  }

  showList() {
    this.setState({ open: true })
  }

  onInputChange(value: string) {
    this.setState({ inputValue: value });
  }

  onSelect(option: DropDownOption) {
    this.setState({ inputValue: option.name, open: false });
    this.props.onChange(option.value);
  }

  render() {
    const { open, inputValue } = this.state;
    const {
      options, placeholder, id, label, large, searchable, value, name,
      meta, classes
    } = this.props;

    let touched = undefined;
    let error = undefined;
    if (meta) {
      touched = meta.touched;
      error = meta.error;
    }
    let validOptions = options;
    if (searchable && inputValue !== '') {
      validOptions = validOptions.filter(option => {
        return option.name.toLowerCase().includes(inputValue.toLowerCase())
      })
    }

    const dropdownClassNames = classNames({
      [classes.dropdown]: true,
      [classes.large]: large,
    });

    const listClassNames = classNames({
      [classes.list]: true,
      [classes.listLarge]: large,
      [classes.listScroll]: validOptions.length > 6,
      [classes.listNoLabel]: !label
    });

    const listId = id + '-list';
    const inputId = id + '-input';
    const labelId = id + '-label';

    return (
      <div className={dropdownClassNames}
        aria-controls={listId}
        aria-haspopup="true"
        aria-expanded={open}
        ref={(node) => (this.wrapperRef = node)} >
        <TextInput
          placeholder={placeholder}
          readOnly={!searchable}
          hasFocus={open}
          id={inputId}
          name={name}
          label={label}
          touched={touched}
          error={error}
          onBlur={this.handleOnBlur.bind(this)}
          className={classes.input}
          onFocus={this.showList.bind(this)}
          onChange={searchable ? this.onInputChange.bind(this) : () => null}
          value={searchable ? inputValue : getValueName(value, options)}
        />
        <ReactCSSTransitionGroup
          transitionName="fade-in-and-out"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {open &&
            <ul className={listClassNames}
              aria-labelledby={labelId}
              id={listId}>
              {validOptions.map((option, index) => {
                return (
                  <li onClick={this.onSelect.bind(this, option)}
                    key={index}
                    className={classes.listItem}>
                    <p>{option.name}</p>
                  </li>
                );
              })}
            </ul>
          }
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}



type RFProps = {
  input: Object,
  options: Array<DropDownOption>,
  placeholder: string,
  label: ReactElement,
  searchable?: boolean,
  large?: boolean,
  meta: Object
}

const StyledDropDown = injectSheet(styles)(DropDown);

const DropDownRF: React.SFC<RFProps, FieldRenderProps> = (props: RFProps) => {
  const { input, ...remainingProps } = props;
  return (
    <StyledDropDown
      id={input.name}
      {...remainingProps}
      {...input}
    />
  )
};

export { StyledDropDown as DropDown, DropDownRF };