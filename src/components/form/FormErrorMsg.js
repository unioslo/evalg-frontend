import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

const styles = theme => ({
  errorMsg: {
    color: theme.formErrorTextColor,
    fontSize: '1.6rem',
    lineHeight: '2.7rem',
  }
})

type Props = {
  msg: ReactElement,
  classes: Object
}

const FormErrorMsg = (props: Props) => {
  return (
    <div className={props.classes.errorMsg}>
      {props.msg}
    </div>
  );
};

export default injectSheet(styles)(FormErrorMsg);
