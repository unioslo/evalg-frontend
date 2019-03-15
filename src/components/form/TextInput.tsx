/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

import FormErrorMsg from './FormErrorMsg';
import { Classes } from 'jss';
import { FieldRenderProps } from 'react-final-form';

interface IProps {
  value: string;
  placeholder?: string;
  onChange?: (event: any) => void;
  readOnly?: boolean;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  id?: string;
  name: string;
  error?: any;
  touched?: boolean;
  className?: string;
  small?: boolean;
  label?: any;
  smallLabel?: boolean;
  labelClassName?: string;
  large?: boolean;
  narrow?: boolean;
  classes: Classes;
  hasFocus?: boolean;
  hideErrors?: boolean;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const styles = (theme: any) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
  },
  textInput: {
    order: 2,
    height: theme.formFieldHeight,
    width: '100%',
    maxWidth: '48.4rem',
    fontSize: theme.formFieldFontSize,
    color: theme.formFieldTextColor,
    border: theme.formFieldBorder,
    borderRadius: theme.formFieldBorderRadius,
    borderColor: theme.formFieldBorderColor,
    transition: `border-color ${theme.formFieldFocusTransition}`,
    paddingLeft: theme.formFieldHorizontalPadding,
    paddingTop: '0.4rem',
    display: 'block',
    '&:focus': {
      borderColor: theme.formFieldBorderActiveColor,
      //transition: `border-color ${theme.formFieldFocusTransition}`,
    },
    '&:focus + label': {
      color: theme.formFieldLabelFocusedColor,
      transition: 'color 200ms ease-in',
    },
  },
  small: {
    height: '3.5rem',
  },
  large: {
    minWidth: theme.formFieldLargeWidth,
  },
  narrow: {
    maxWidth: '22.3rem',
  },
  error: {
    borderColor: `${theme.formFieldBorderErrorColor} !important`,
  },
  errorMsg: {
    order: 3,
  },
  label: {
    order: 1,
    fontSize: '2rem',
    lineHeight: 1.45,
    color: theme.formFieldLabelUnfocusedColor,
    transition: 'color 200ms ease-in',
    marginBottom: '2rem',
    display: 'block',
  },
  labelSmall: {
    fontSize: '1.8rem',
    lineHeight: 1.61,
  },
  labelFocus: {
    color: theme.formFieldLabelFocusedColor,
    transition: 'color 200ms ease-in',
  },
});

const TextInput = (props: IProps) => {
  const {
    value,
    error,
    placeholder,
    onChange,
    readOnly,
    id,
    onBlur,
    onFocus,
    name,
    className,
    small,
    label,
    smallLabel,
    labelClassName,
    large,
    touched,
    narrow,
    disabled,
    classes,
    hasFocus,
    hideErrors,
  } = props;
  const extraInputClassName = className ? className : '';
  const inputClassNames = classNames({
    [classes.textInput]: true,
    [classes.small]: small,
    [classes.large]: large,
    [classes.error]: error && touched,
    [classes.narrow]: narrow,
    [extraInputClassName]: true,
  });
  const extraLabelClassName = labelClassName ? labelClassName : '';
  const labelClassNames = classNames({
    [classes.label]: true,
    [classes.labelSmall]: smallLabel,
    [classes.labelFocus]: hasFocus,
    [extraLabelClassName]: true,
  });

  const handleOnChange = (event: any) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };
  return (
    <div className={classes.container}>
      {!hideErrors && touched && error && (
        <FormErrorMsg
          msg={error}
          // className={classes.errorMsg}
        />
      )}
      <input
        type="text"
        className={inputClassNames}
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleOnChange}
        readOnly={readOnly}
        onFocus={onFocus}
        onBlur={onBlur}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        ref={props.inputRef}
      />
      {!!label && (
        <label htmlFor={id} className={labelClassNames}>
          {label}
        </label>
      )}
    </div>
  );
};

const StyledTextInput = injectSheet(styles)(TextInput);

export default StyledTextInput;

/* Redux Form Wrapper */

interface IRFProps extends FieldRenderProps {
  placeholder?: string;
  readOnly?: boolean;
  id?: string;
  className?: string;
  small?: boolean;
  label?: any;
  smallLabel?: boolean;
  labelClassName?: string;
  // input: {
  //   name: string,
  //   value: string,
  //   onChange: Function,
  //   onFocus?: Function,
  //   onBlur?: Function,
  // },
  // meta: {
  //   error: any,
  //   touched: boolean
  // }
}

export const TextInputRF = (props: IRFProps) => {
  const { input, meta, ...restProps } = props;
  return <StyledTextInput {...input} {...meta} {...restProps} />;
};
