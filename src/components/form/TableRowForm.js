import * as React from 'react';
import injectSheet from 'react-jss';

const styles = theme => ({
  form: {
    padding: '3rem 0'
  },
  fields: {
    display: 'flex'
  }
})

type Props = {
  children?: ReactChildren,
  header?: ReactElement | string,
  classes: Object
}

const TableRowFormFields = (props: Props) => {
  return (
    <div className={props.classes.fields}>
      {props.children}
    </div>
  );
};

const StyledFields = injectSheet(styles)(TableRowFormFields);

const TableRowForm = (props: Props) => {
  return (
    <div className={props.classes.form}>
      {props.header &&
        <h3><b>{props.header}</b></h3>
      }
      {props.children}
    </div>
  );
};

const StyledForm = injectSheet(styles)(TableRowForm);

export {
  StyledFields as TableRowFormFields,
  StyledForm as TableRowForm
};