import React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';
import classNames from 'classnames';

interface IProps {
  selected?: boolean;
  action?: () => void;
  classes: Classes;
}

const styles = (theme: any) => ({
  arrow: {
    display: 'inline-block',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  arrowIcon: {
    fill: theme.dropDownArrowColor,
  },
});

const DrowdownArrowIcon = (props: IProps) => {
  let transform = 'translate(0, 2)';
  if (props.selected) {
    transform = 'translate(-5, 0) rotate(90, 6, 12)';
  }
  const dropDownArrowCls = classNames({
    [props.classes.arrow]: true,
    'button-no-style': true,
  })

  return (
    <button onClick={props.action} className={dropDownArrowCls}>
      <svg width="30" height="20" viewBox="0 0 19 20">
        <path
          d="M2.609 0L0 2.608l6.506 6.604L0 15.715l2.609 2.609 9.112-9.112z"
          className={props.classes.arrowIcon}
          transform={transform}
          fillRule="evenodd"
        />
      </svg>
    </button>
  )
};

export default injectSheet(styles)(DrowdownArrowIcon);
