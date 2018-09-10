/* @flow */
import * as React from 'react';
import classNames from 'classnames';
type Props = {
  children?: ReactChildren,
  inline?: boolean,
  flex?: boolean,
  flexGrow?: boolean,
  noTopMargin?: boolean
};

const FormFieldGroup = (props: Props) => {
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