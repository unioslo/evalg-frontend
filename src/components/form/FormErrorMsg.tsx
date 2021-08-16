import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
  errorMsg: {
    color: theme.formErrorTextColor,
    fontSize: '1.6rem',
    lineHeight: '2.7rem',
  }
}));

interface IProps {
  msg: any,
}

const FormErrorMsg: React.FunctionComponent<IProps> = (props) => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <div className={classes.errorMsg}>
      {props.msg}
    </div>
  );
};

export default FormErrorMsg;
