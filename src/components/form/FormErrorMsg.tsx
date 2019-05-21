import React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

const styles = (theme: any) => ({
  errorMsg: {
    color: theme.formErrorTextColor,
    fontSize: '1.6rem',
    lineHeight: '2.7rem',
  }
})

interface IProps {
  msg: any,
  classes: Classes,
}

const FormErrorMsg = (props: IProps) => {
  return (
    <div className={props.classes.errorMsg}>
      {props.msg}
    </div>
  );
};

export default injectSheet(styles)(FormErrorMsg);
