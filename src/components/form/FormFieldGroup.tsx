import React from 'react';
import classNames from 'classnames';

interface IProps {
  children?: React.ReactNode,
  inline?: boolean,
  flex?: boolean,
  flexGrow?: boolean,
  noTopMargin?: boolean
};

const FormFieldGroup = (props: IProps) => {
  const { inline, flex, flexGrow, noTopMargin } = props;
  const cls = classNames({
    'formfieldgroup': true,
    'formfieldgroup-inline': inline,
    'formfieldgroup-flex': flex,
    'formfieldgroup-flexgrow': flexGrow,
    'formfieldgroup-notopmargin': noTopMargin
  });

  return (
    <div className={cls}>
      {props.children}
    </div>
  );
};

export default FormFieldGroup;