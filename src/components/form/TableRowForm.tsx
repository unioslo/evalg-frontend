import React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import Text from 'components/text';

const styles = (theme: any) => ({
  form: {
    padding: '3rem 0',
  },
  fields: {
    display: 'flex',
  },
  header: {
    marginBottom: '2rem',
  },
});

interface IProps {
  children?: React.ReactNode;
  header?: any | string;
  classes: Classes;
}

const TableRowFormFields = (props: IProps) => {
  return <div className={props.classes.fields}>{props.children}</div>;
};

const StyledFields = injectSheet(styles)(TableRowFormFields);

const TableRowForm = (props: IProps) => {
  return (
    <div className={props.classes.form}>
      {props.header && (
        <div className={props.classes.header}>
          <Text bold size="large">
            {props.header}
          </Text>
        </div>
      )}
      {props.children}
    </div>
  );
};

const StyledForm = injectSheet(styles)(TableRowForm);

export { StyledFields as TableRowFormFields, StyledForm as TableRowForm };
