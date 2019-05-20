import classNames from 'classnames';
import React from 'react';
import injectSheet from 'react-jss';


const styles = () => ({
  actionItem: {
    '&:hover': {
      cursor: 'pointer'
    },
    alignItems: 'center',
    display: 'inline-flex',
    height: '100%',
  },
  alignCenter: {
    justifyContent: 'center'
  },
  alignRight: {
    justifyContent: 'flex-end'
  }
})

interface IProps {
  action: () => void,
  alignRight?: boolean,
  alignCenter?: boolean,
  classes?: any,
}

const ActionItem: React.SFC<IProps> = (props) => {
  const { classes } = props;
  const cls = classNames({
    "button-no-style": true,
    [classes.actionItem]: true,
    [classes.alignCenter]: props.alignCenter,
    [classes.alignRight]: props.alignRight
  });
  return (
    <button className={cls} onClick={props.action} >
      {props.children}
    </button>
  )
};

export default injectSheet(styles)(ActionItem);