import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';

import Text from 'components/text';

const useStyles = createUseStyles((theme: any) => ({
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

interface IProps {
  children?: React.ReactNode;
  header?: any | string;
}

const TableRowFormFields: React.FunctionComponent<IProps> = (props) => {
  const { children } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });

  return <div className={classes.fields}>{children}</div>;
};

const TableRowForm: React.FunctionComponent<IProps> = (props) => {
  const { children, header } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <div className={classes.form}>
      {header && (
        <div className={classes.header}>
          <Text bold size="large">
            {props.header}
          </Text>
        </div>
      )}
      {children}
    </div>
  );
};

export { TableRowFormFields, TableRowForm };
