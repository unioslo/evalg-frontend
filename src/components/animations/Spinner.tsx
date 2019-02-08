import * as React from 'react';

import classNames from 'classnames';
import injectSheet from 'react-jss';

const styles = () => ({
  spinner: {
    position: 'relative',
    top: -5,
    marginLeft: 10,
    marginRight: -2,
    display: 'inline-block',
    width: '2.5rem',
    height: '2.5rem',
    border: '3px solid rgba(255,255,255)',
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
