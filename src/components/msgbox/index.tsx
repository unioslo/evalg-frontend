import React from 'react';
import injectSheet from 'react-jss';

import Icon from 'components/icon';

const defaultTimeoutSec = 10;

const styles = () => ({
  info: {
    marginTop: (props: IProps) => (props.small ? '0px' : '30px'),
    minHeight: '64px',
    display: 'flex',
    margin: '0 auto',
    justifyContent: 'center',
    maxWidth: (props: IProps) => (props.small ? '740px' : ''),
    backgroundColor: '#f4f9fa',
    border: '2px',
    borderStyle: 'solid',
    boxSizing: 'border-box',
    borderRadius: '4px',
    borderColor: '#8eced9',
  },
  msg: {
    fontFamily: 'Arial',
    fontSize: (props: IProps) => (props.warning ? '19px' : '16px'),
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
  msg: string | React.ReactNode;
  timeout: boolean;
  timeoutSec?: number;
  small?: boolean;
  warning?: boolean;
  classes: any;
}

interface IState {
  display: boolean;
}

class MsgBox extends React.Component<IProps, IState> {
  public static defaultProps = {
    small: false,
    warning: false,
  };

  public timerHandle: NodeJS.Timer | null;

  constructor(props: IProps) {
    super(props);
    this.timerHandle = null;
    this.state = {
      display: true,
    };

    this.closeBox = this.closeBox.bind(this);
  }

  public componentDidMount() {
    // TODO fadeout?

    if (this.props.timeout) {
      const waitTime = (this.props.timeoutSec || defaultTimeoutSec) * 1000;
      this.timerHandle = setTimeout(() => {
        this.setState({ display: false });
        this.timerHandle = null;
      }, waitTime);
    }
  }

  public componentWillUnmount() {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = null;
    }
  }

  public closeBox() {
    this.setState({ display: false });
  }

  public render() {
    const { classes } = this.props;

    if (this.state.display) {
      return (
        <div className={classes.info}>
          <div className={classes.infoIconMargins}>
            <Icon type="infoMsgBox" />
          </div>
          <span className={classes.msg}>{this.props.msg}</span>
          <div className={classes.closeIconMargins}>
            <Icon type="closeMsgBox" onClick={this.closeBox} />
          </div>
        </div>
      );
    }
    return null;
  }
}

const StyledMsgBox = injectSheet(styles)(MsgBox);
export { StyledMsgBox as MsgBox };
