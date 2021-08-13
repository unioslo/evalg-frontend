import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
  menu: {
    display: 'none',
    listStyleType: 'none',
    fontSize: theme.navFontSize,
  },
  [theme.breakpoints.mdQuery]: {
    menu: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  menuItem: {
    color: theme.navMenuTextColor,
    marginLeft: '2rem',
  },
}));

interface IProps {};

const DesktopMenu: React.FunctionComponent<IProps> = ({
  children,
}) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return <ul className={classes.menu}>{children}</ul>;
};

const DesktopMenuItem: React.FunctionComponent<IProps> = ({
  children,
}) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return <li className={classes.menuItem}>{children}</li>;
};

export {DesktopMenu, DesktopMenuItem};
