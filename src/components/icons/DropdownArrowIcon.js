/* @flow */
import * as React from 'react';
import injectSheet from 'react-jss';

type Props = {
  selected?: boolean,
  action: Function,
  classes: Object
}

const styles = theme => ({
  arrow: {
    display: 'inline-block',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  arrowIcon: {
    fill: theme.dropDownArrowColor
  }
})

const TableCellDropdownArrow = (props: Props) => {
  let transform = 'translate(0, 2)';
  if (props.selected) {
    transform = 'translate(-5, 0) rotate(90, 6, 12)';
  }
  return (
    <div onClick={props.action} className={props.classes.arrow}>
      <svg width="30" height="20" viewBox="0 0 19 20">
        <path d="M2.609 0L0 2.608l6.506 6.604L0 15.715l2.609 2.609 9.112-9.112z"
          className={props.classes.arrowIcon}
          transform={transform}
          fillRule="evenodd" />
      </svg>
    </div>
  )
};

export default injectSheet(styles)(TableCellDropdownArrow);