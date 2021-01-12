import React from 'react';
import injectSheet from 'react-jss';
import classNames from 'classnames';

import Icon from 'components/icon';

const styles = () => ({
  alert: {
    marginTop: (props: IProps) => (props.small ? '0px' : '30px'),
    minHeight: '64px',
    display: 'flex',
    margin: '0 auto',
    maxWidth: (props: IProps) => (props.small ? '740px' : ''),
    border: '2px',
    borderStyle: 'solid',
    boxSizing: 'border-box',
    borderRadius: '4px',
  },

  info: {
    background: '#5690a2',
    boarderColor: '#e0f5fb',
  },

  success: {
    background: '#06893a',
    boarderColor: '#cde7d8',
  },

  warning: {
    backgroundColor: '#d87f0a',
    boarderColor: '#ffe9cc',
  },

  error: {
    backgroundColor: '#f1d8d4',
    boarderColor: '#ba3a26;',
  },

  msg: {
    fontFamily: 'Arial',
    fontSize: '16px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: '1.56',
    letterSpacing: 'normal',
    textAlign: 'left',
    color: '#555555',
    margin: 'auto',
    marginRight: '0px',
    marginLeft: '0px',
  },

  msgBoxMargins: {
    margin: 'auto',
    marginRight: '25px',
    marginLeft: '20px',
  },

  infoIconMargins: {
    margin: 'auto',
    marginRight: '20px',
    marginLeft: '20px',
  },

  closeIconMargins: {
    margin: 'auto',
    marginRight: '20px',
    marginLeft: 'auto',
  },
});

interface IProps {
  children: string | React.ReactNode;
  type: 'info' | 'success' | 'warning' | 'error';
  classes: any;
  small?: boolean;
}

// TODO add icons for info, success and warning
const Alert: React.FunctionComponent<IProps> = props => {
  const { classes, children, type } = props;

  const cls = classNames({
    [classes.alert]: true,
    [classes.info]: type === 'info',
    [classes.success]: type === 'success',
    [classes.warning]: type === 'warning',
    [classes.error]: type === 'error',
  });

  return (
    <div className={cls}>
      <div className={classes.infoIconMargins}>
        {type === 'error' && <Icon type="errorMsg" />}
      </div>
      <span className={classes.msg}>{children}</span>
    </div>
  );
};

export default injectSheet(styles)(Alert);
