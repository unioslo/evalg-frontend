import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { FieldRenderProps } from 'react-final-form';
import { Classes } from 'jss';

import DropDownBase from 'components/baseComponents/DropDownBase';
import TextInput from './TextInput';

const styles = (theme: any) => ({
  dropdown: {
    position: 'relative',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  dropDownNoRelativePositionOfListOnMobile: {
    position: 'static',
    [theme.breakpoints.mdQuery]: {
      position: 'relative',
    },
  },
  dropdownNormal: {
    width: theme.dropDownWidth,
    fontSize: theme.formFieldFontSize,
    color: theme.formFieldTextColor,
    backgroundColor: theme.colors.white,
  },
  dropdownInline: {
    display: 'inline-block',
    width: 'fit-content',
    color: theme.inlineDropdownTextColor,
    background: 'url("/dropdownarrow.svg") no-repeat right 7px top 50%',
    backgroundSize: '14px 9px',
    backgroundColor: theme.colors.white,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    border: 0,
    borderBottomWidth: '2px',
    borderBottomStyle: 'dotted',
    borderBottomColor: theme.inlineDropdownBottomBorderColor,
    '& .inlineOptionNameText': {
      marginRight: 30,
    },
  },
  large: {
    width: theme.dropDownWidthLarge,
  },
  list: {
    position: 'absolute',
    left: 0,
    top: '9.6rem',
    fontFamily: 'Arial, sans-serif',
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
    overflowY: 'scroll',
  },
  listLarge: {
    width: theme.dropDownWidthLarge,
  },
  listItem: {
    borderBottom: `0.1rem solid ${theme.formFieldBorderColor}`,
    padding: `0.7rem ${theme.formFieldHorizontalPadding}`,
    minHeight: '3rem',
    '&:hover': {
      background: theme.lightBlueGray,
      cursor: 'pointer',
    },
    '&:last-child': {
      borderBottom: 0,
    },
  },
  secondaryLine: {
    color: theme.dropDownSecondaryLineColor,
  },
  input: {
    backgroundImage: 'url("/dropdownarrow.svg")',
    backgroundPosition: 'right 13px top 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '14px 9px',
  },
});

interface IDropDownOption {
  name: string;
  secondaryLine?: string;
  value: any;
}

const getValueName = (value: any, options: Array<IDropDownOption>): string => {
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === value) {
      return options[i].name;
    }
  }
  return '';
};

interface IProps {
  options: any[];
  placeholder?: string;
  // value: number,
  value: any;
  onBlur?: (event: any) => void;
  onChange: (event: any) => void;
  label?: any;
  searchable?: boolean;
  large?: boolean;
  inline?: boolean;
  noRelativePositionOfListOnMobile?: boolean;
  name?: string;
  // meta: object,
  classes: Classes;

  // Added in ts convertion..
  id?: any;
  disabled?: boolean;
}

class DropDown extends DropDownBase<IProps> {
  // state: IDropDownState;
  timeoutID?: any;

  componentDidMount() {
    super.componentDidMount();
    if (this.props.searchable && this.props.value !== '') {
      this.setState({
        inputValue: this.props.options[this.props.value].name,
      });
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.value === '') {
      this.setState({ inputValue: '' });
    }
  }

  handleOnFocus() {
    clearTimeout(this.timeoutID);
    if (!this.state.open) {
      this.setState({ open: true });
    }
  }

  handleOnBlur() {
    this.timeoutID = setTimeout(() => {
      this.setState({ open: false });
    }, 0);
  }

  onInputChange(value: string) {
    this.setState({ inputValue: value });
  }

  onSelect(option: IDropDownOption, event: any) {
    event.preventDefault();
    this.setState({ inputValue: option.name, open: false });
    this.props.onChange(option.value);
  }

  render() {
    const { open, inputValue } = this.state;
    const {
      options,
      placeholder,
      id,
      label,
      large,
      inline, // if inline is true, searchable has no effect
      noRelativePositionOfListOnMobile,
      searchable,
      disabled,
      value,
      name,
      // meta,
      classes,
    } = this.props;

    let touched = undefined;
    let error = undefined;
    // if (meta) {
    //   touched = meta.touched;
    //   error = meta.error;
    // }
    let validOptions = options;
    if (searchable && inputValue !== '') {
      validOptions = validOptions.filter(option => {
        return option.name.toLowerCase().includes(inputValue.toLowerCase());
      });
    }

    const dropdownClassNames = classNames({
      [classes.dropdown]: true,
      [classes.dropdownNormal]: !inline,
      [classes.dropdownInline]: inline,
      [classes.dropDownNoRelativePositionOfListOnMobile]: noRelativePositionOfListOnMobile,
      [classes.large]: large,
    });

    const listClassNames = classNames({
      [classes.list]: true,
      [classes.listLarge]: large,
      [classes.listScroll]: validOptions.length > 6,
      [classes.listNoLabel]: !label,
    });

    const listId = id + '-list';
    const inputId = id + '-input';
    const labelId = id + '-label';

    const nameValue: string = name ? name : '';

    return (
      <div
        className={dropdownClassNames}
        aria-controls={listId}
        aria-haspopup="true"
        aria-expanded={open}
        ref={node => (this.wrapperRef = node)}
        onBlur={this.handleOnBlur.bind(this)}
        onFocus={this.handleOnFocus.bind(this)}
        tabIndex={0}
      >
        {inline ? (
          <div>
            <div className={'inlineOptionNameText'}>
              {getValueName(value, options).toLowerCase()}
            </div>
          </div>
        ) : (
          <TextInput
            placeholder={placeholder}
            readOnly={!searchable}
            hasFocus={open}
            id={inputId}
            name={nameValue}
            label={label}
            touched={touched}
            disabled={disabled}
            error={error}
            className={classes.input}
            onChange={searchable ? this.onInputChange.bind(this) : () => null}
            value={searchable ? inputValue : getValueName(value, options)}
            tabIndex={-1}
          />
        )}
        <TransitionGroup>
          <CSSTransition
            classNames="fade-in-and-out"
            timeout={{ enter: 500, exit: 300 }}
          >
            <div>
              {open && (
                <ul
                  className={listClassNames}
                  aria-labelledby={labelId}
                  id={listId}
                >
                  {validOptions.map((option, index) => {
                    return (
                      <li
                        key={index}
                        className={classes.listItem}
                        onKeyDown={(
                          event: React.KeyboardEvent<HTMLLIElement>
                        ) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            this.onSelect(option, event);
                          }
                        }}
                        onClick={(
                          event: React.MouseEvent<HTMLElement, MouseEvent>
                        ) => {
                          this.onSelect(option, event);
                        }}
                        tabIndex={0}
                      >
                        <p>{option.name}</p>
                        {option.secondaryLine && (
                          <p className={classes.secondaryLine}>
                            {option.secondaryLine}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    );
  }
}

interface IRFProps extends FieldRenderProps {
  options: IDropDownOption[];
  placeholder: string;
  label: any;
  searchable?: boolean;
  large?: boolean;
  classes: Classes;
}

// const DropDownRF: React.SFC<IRFProps> = (props: IRFProps) => {
const DropDownRF = (props: IRFProps) => {
  const { input, ...remainingProps } = props;
  return <DropDown id={input.name} {...remainingProps} {...input} />;
};

const StyledDropDown = injectSheet(styles)(DropDown);
const StyledDropDownRF = injectSheet(styles)(DropDownRF);
export { StyledDropDown as DropDown, StyledDropDownRF as DropDownRF };
