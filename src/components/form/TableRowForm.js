import * as React from 'react';

type Props = {
  children?: ReactChildren,
  header?: ReactElement | string
}

export const TableRowFormFields = (props: Props) => {
  return (
    <div className="tablerowform--fields">
      {props.children}
    </div>
  );
};


export const TableRowForm = (props: Props) => {
  return (
    <div className="tablerowform">
      {props.header &&
        <h3><b>{ props.header }</b></h3>
      }
      {props.children}
    </div>
  );
};

