import React from 'react';
import { createUseStyles } from 'react-jss';

import Text from 'components/text';

const useStyles = createUseStyles(() => ({
  form: {
    padding: '3rem 0',
  },
  fields: {
    display: 'flex',
  },
  header: {
    marginBottom: '2rem',
  },
}));

type TableRowFormFieldsProps = {
  children: React.ReactNode;
};

export function TableRowFormFields({ children }: TableRowFormFieldsProps) {
  const classes = useStyles();
  return <div className={classes.fields}>{children}</div>;
}

type TableRowFormProps = {
  children: React.ReactNode;
  header?: string;
};

export function TableRowForm({ children, header }: TableRowFormProps) {
  const classes = useStyles();
  return (
    <div className={classes.form}>
      {header && (
        <div className={classes.header}>
          <Text bold size="large">
            {header}
          </Text>
        </div>
      )}
      {children}
    </div>
  );
}

TableRowForm.defaultProps = {
  header: undefined,
};
