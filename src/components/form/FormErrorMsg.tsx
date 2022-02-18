import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
  errorMsg: {
    color: theme.formErrorTextColor,
    fontSize: '1.6rem',
    lineHeight: '2.7rem',
  },
}));

interface IProps {
  msg: any;
}

const FormErrorMsg: React.FunctionComponent<IProps> = (props) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const { msg } = props;

  return <div className={classes.errorMsg}>{msg}</div>;
};

export default FormErrorMsg;
