import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

import Icon from 'components/icon';

const useStyles = createUseStyles({
  info: {
    marginTop: (props: MsgBoxProps) => (props.small ? '0px' : '30px'),
    minHeight: '64px',
    display: 'flex',
    margin: '0 auto',
    maxWidth: (props: MsgBoxProps) => (props.small ? '740px' : ''),
    backgroundColor: (props: MsgBoxProps) =>
      props.warning ? '#f8d7da' : '#f4f9fa',
    border: '2px',
    borderStyle: 'solid',
    boxSizing: 'border-box',
    borderRadius: '4px',
    borderColor: (props: MsgBoxProps) =>
      props.warning ? '#f5c6cb' : '#8eced9',
  },
  msg: {
    fontFamily: 'Arial',
    fontSize: (props: MsgBoxProps) => (props.warning ? '21px' : '16px'),
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

type MsgBoxProps = {
  disableClose?: boolean;
  msg: string | React.ReactNode;
  timeout: boolean;
  timeoutSec?: number;
  small?: boolean;
  warning?: boolean;
};
export function MsgBox(props: MsgBoxProps) {
  const [display, setDisplay] = useState<boolean>(true);
  const { disableClose = false, msg, timeout, timeoutSec, warning } = props;
  const classes = useStyles({ ...props });

  useEffect(() => {
    let timerHandle: NodeJS.Timer | null;
    if (timeout) {
      const waitTime = (timeoutSec || 10) * 1000;
      timerHandle = setTimeout(() => {
        setDisplay(false);
        timerHandle = null;
      }, waitTime);
    }
    return () => {
      if (timerHandle) {
        clearTimeout(timerHandle);
        timerHandle = null;
      }
    };
  });

  if (display) {
    return (
      <div className={classes.info}>
        <div className={classes.infoIconMargins}>
          {!warning && <Icon type="infoMsgBox" />}
        </div>
        <span className={classes.msg}>{msg}</span>
        <div className={classes.closeIconMargins}>
          {!warning && !disableClose && (
            <Icon type="closeMsgBox" onClick={() => setDisplay(false)} />
          )}
        </div>
      </div>
    );
  }
  return null;
}

MsgBox.defaultProps = {
  timeoutSec: 10,
  small: false,
  warning: false,
};
