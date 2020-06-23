import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';

const styles = (theme: any) => ({
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
});

interface IProps extends WithStylesProps<typeof styles> {}

const DesktopMenu: React.FunctionComponent<IProps> = ({
  children,
  classes,
}) => {
  return <ul className={classes.menu}>{children}</ul>;
};

const DesktopMenuItem: React.FunctionComponent<IProps> = ({
  children,
  classes,
}) => {
  return <li className={classes.menuItem}>{children}</li>;
};

const StyledDesktopMenu = injectSheet(styles)(DesktopMenu);
const StyledDesktopMenuItem = injectSheet(styles)(DesktopMenuItem);

export {
  StyledDesktopMenu as DesktopMenu,
  StyledDesktopMenuItem as DesktopMenuItem,
};
