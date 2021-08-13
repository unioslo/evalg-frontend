import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import classNames from 'classnames';

interface IProps {
  selected?: boolean;
  action?: () => void;
}

const useStyles = createUseStyles((theme: any) => ({
  arrow: {
    display: 'inline-block',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  arrowIcon: {
    fill: theme.dropDownArrowColor,
  },
}));

const DrowdownArrowIcon = (props: IProps) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const {selected, action} = props

  let transform = 'translate(0, 2)';
  if (selected) {
    transform = 'translate(-5, 0) rotate(90, 6, 12)';
  }
  const dropDownArrowCls = classNames({
    [classes.arrow]: true,
    'button-no-style': true,
  });

  return (
    <button onClick={action} className={dropDownArrowCls}>
      <svg width="30" height="20" viewBox="0 0 19 20">
        <path
          d="M2.609 0L0 2.608l6.506 6.604L0 15.715l2.609 2.609 9.112-9.112z"
          className={classes.arrowIcon}
          transform={transform}
          fillRule="evenodd"
        />
      </svg>
    </button>
  );
};

export default DrowdownArrowIcon;
