import React from 'react';
import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';
import { FieldRenderProps } from 'react-final-form';

import FormErrorMsg from 'components/form/FormErrorMsg';

interface TextAreaInputProps extends FieldRenderProps<string, any> {
  label: string;
}

const useStyles = createUseStyles((theme: any) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
    width: (props: TextAreaInputProps) =>
      props.containerWidth ? props.containerWidth : 'inherit',
  },
  textArea: {
    minWidth: theme.formFieldLargeWidth,
    minHeight: '10rem',
    width: '100%',
    padding: 10,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    border: theme.formFieldBorder,
    borderColor: theme.formFieldBorderColor,
    borderRadius: theme.formFieldBorderRadius,
  },

  textInput: {
    height: theme.formFieldHeight,
    width: '100%',
    maxWidth: (props: TextAreaInputProps) =>
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
  error: {
    borderColor: `${theme.formFieldBorderErrorColor} !important`,
  },
  label: {
    fontSize: '2rem',
    lineHeight: 1.45,
    color: theme.formFieldLabelUnfocusedColor,
    transition: 'color 200ms ease-in',
    marginBottom: '2rem',
    display: 'block',
  },
  labelFocus: {
    color: theme.formFieldLabelFocusedColor,
    transition: 'color 200ms ease-in',
  },
}));

export default function TextAreaInput(props: TextAreaInputProps) {
  const { label, input, meta, ...rest } = props;
  const { name } = input;
  const { active, error, touched } = meta;
  const theme = useTheme();
  const classes = useStyles({ ...props, theme });

  const textAreaClassNames = classNames({
    [classes.textArea]: true,
    [classes.error]: error && touched,
  });

  const labelClassNames = classNames({
    [classes.label]: true,
    [classes.labelFocus]: active,
  });

  return (
    <div className={classes.container}>
      {!!label && (
        <label htmlFor={name} className={labelClassNames}>
          {label}
        </label>
      )}
      {/* eslint-disable-next-line */}
      <textarea className={textAreaClassNames} {...input} {...rest} />
      {touched && error && <FormErrorMsg msg={error} />}
    </div>
  );
}
