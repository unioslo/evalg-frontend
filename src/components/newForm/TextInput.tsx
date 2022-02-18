import React from 'react';
import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';
import { FieldRenderProps } from 'react-final-form';

import FormErrorMsg from 'components/form/FormErrorMsg';

interface TextInputProps extends FieldRenderProps<string, any> {
  className?: string;
  small?: boolean;
  label?: any;
  smallLabel?: boolean;
  labelClassName?: string;
  large?: boolean;
  narrow?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  containerWidth?: string;
  noInputMaxWidth?: boolean;
  tabIndex?: number;
}

const useStyles = createUseStyles((theme: any) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
    width: (props: TextInputProps) =>
      props.containerWidth ? props.containerWidth : 'inherit',
  },
  textInput: {
    height: theme.formFieldHeight,
    width: '100%',
    minWidth: theme.formFieldLargeWidth,
    maxWidth: (props: TextInputProps) =>
      props.noInputMaxWidth ? 'inherit' : '48.4rem',
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
  label: {
    fontSize: '2rem',
    lineHeight: 1.45,
    color: theme.formFieldLabelUnfocusedColor,
    transition: 'color 200ms ease-in',
    marginBottom: '1rem',
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
}));

export default function TextInput(props: TextInputProps) {
  const {
    className,
    containerWidth,
    input,
    inputRef,
    label,
    labelClassName,
    large,
    meta,
    narrow,
    noInputMaxWidth,
    small,
    smallLabel,
    tabIndex,
    ...rest
  } = props;

  const { name } = input;
  const { active, error, touched } = meta;

  const theme = useTheme();
  const classes = useStyles({ ...props, theme });

  // eslint-disable-next-line
  const extraInputClassName = className ? className : '';
  const inputClassNames = classNames({
    [classes.textInput]: true,
    [classes.small]: small,
    [classes.large]: large,
    [classes.error]: error && touched,
    [classes.narrow]: narrow,
    [extraInputClassName]: true,
  });
  // eslint-disable-next-line
  const extraLabelClassName = labelClassName ? labelClassName : '';
  const labelClassNames = classNames({
    [classes.label]: true,
    [classes.labelSmall]: smallLabel,
    [classes.labelFocus]: active,
    [extraLabelClassName]: true,
  });

  return (
    <div className={classes.container}>
      {!!label && (
        <label htmlFor={name} className={labelClassNames}>
          {label}
        </label>
      )}
      <input
        type="text"
        {...input}
        {...rest}
        className={inputClassNames}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        ref={inputRef}
        tabIndex={tabIndex}
      />
      {touched && error && <FormErrorMsg msg={error} />}
    </div>
  );
}

TextInput.defaultProps = {
  className: undefined,
  small: false,
  label: undefined,
  smallLabel: false,
  labelClassName: undefined,
  large: false,
  narrow: false,
  inputRef: undefined,
  containerWidth: undefined,
  noInputMaxWidth: false,
  tabIndex: undefined,
};
