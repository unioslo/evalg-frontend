/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

import FormErrorMsg from './FormErrorMsg';

type Props = {
  value: string,
  placeholder?: string | Object,
  onChange?: Function,
  readOnly?: boolean,
  onFocus?: Function,
  onBlur?: Function,
  id?: string,
  name: string,
  error?: any,
  touched?: boolean,
  className?: string,
  small?: boolean,
  label?: ReactElement,
  smallLabel?: boolean,
  labelClassName?: string,
  large?: boolean,
  narrow?: boolean,
  classes: Object,
  hasFocus?: boolean,
  hideErrors?: boolean,
  inline: boolean,
};

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
  },
  inlineContainer: {
    display: 'inline-block',
  },
  textInput: {
    order: 2,
    height: theme.formFieldHeight,
    width: '100%',
    maxWidth: '48.4rem',
    fontSize: theme.formFieldFontSize,
    color: theme.formFieldTextColor,
    transition: `border-color ${theme.formFieldFocusTransition}`,
    paddingLeft: theme.formFieldHorizontalPadding,
    paddingTop: '0.4rem',
    '&:focus + label': {
      color: theme.formFieldLabelFocusedColor,
      transition: 'color 200ms ease-in',
    },
  },
  blockTextInput: {
    display: 'block',
    border: theme.formFieldBorder,
    borderRadius: theme.formFieldBorderRadius,
    borderColor: theme.formFieldBorderColor,
    '&:focus': {
      borderColor: theme.formFieldBorderActiveColor,
      //transition: `border-color ${theme.formFieldFocusTransition}`,
    },
  },
  inlineTextInput: {
    display: 'inline-block',
    fontFamily: 'inherit',
    color: theme.inlineFormFieldBottomBorderColor,
    fontSize: 'inherit',
    border: 0,
    borderBottomWidth: '4px',
    borderBottomStyle: 'dotted',
    borderBottomColor: theme.inlineFormFieldBottomBorderColor,
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

const TextInput = (props: Props) => {
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
    classes,
    hasFocus,
    hideErrors,
    inline,
  } = props;
  const extraInputClassName = className ? className : '';
  const inputClassNames = classNames({
    [classes.textInput]: true,
    [classes.blockTextInput]: !inline,
    [classes.inlineTextInput]: inline,
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

  const handleOnChange = evt => {
    if (onChange) {
      onChange(evt.target.value);
    }
  };
  return (
    <div className={inline ? classes.inlineContainer : classes.container}>
      {!hideErrors && touched && error && (
        <FormErrorMsg msg={error} className={classes.errorMsg} />
      )}
      <input
        type="text"
        className={inputClassNames}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleOnChange}
        readOnly={readOnly}
        onFocus={onFocus}
        onBlur={onBlur}
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

type RFProps = {
  placeholder?: string,
  readOnly?: boolean,
  id?: string,
  className?: string,
  small?: boolean,
  label?: ReactElement,
  smallLabel?: boolean,
  labelClassName?: string,
  input: {
    name: string,
    value: string,
    onChange: Function,
    onFocus?: Function,
    onBlur?: Function,
  },
  meta: {
    error: any,
    touched: boolean,
  },
};

export const TextInputRF = (props: RFProps) => {
  const { input, meta, ...restProps } = props;
  return <StyledTextInput {...input} {...meta} {...restProps} />;
};
