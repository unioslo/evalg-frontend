import React from 'react';

import classNames from 'classnames';
import injectSheet from 'react-jss';

const styles = () => ({
  spinner: {
    position: 'relative',
    display: 'inline-block',
    width: (props: IProps) => props.size ? props.size : '2.5rem',
    height: (props: IProps) => props.size ? props.size : '2.5rem',
    marginLeft: (props: IProps) => props.marginLeft ? props.marginLeft : 0,
    marginRight: (props: IProps) => props.marginRight ? props.marginRight : 0,
    border: '3px solid rgba(255,255,255, .3)',
    borderWidth: (props: IProps) => props.thin ? '2px' : '3px',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: 'spin 0.8s linear infinite',
  },
  darkStyle: {
    border: '3px solid rgba(200,200,200)',
    borderTopColor: 'rgba(50,50,50)',
  },
  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
  },
});

interface IProps {
  darkStyle?: boolean;
  size?: string;
  thin?: boolean;
  marginLeft?: string;
  marginRight?: string;
  classes: any;
}

const Spinner = ({ classes, darkStyle }: IProps) => {
  const cls = classNames({
    [classes.spinner]: true,
    [classes.darkStyle]: darkStyle,
  });
  return <div className={cls} />;
};

export default injectSheet(styles)(Spinner);
