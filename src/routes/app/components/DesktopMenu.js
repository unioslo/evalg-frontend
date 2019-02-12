import * as React from 'react';
import injectSheet from 'react-jss';

type Props = {
  children: ReactChildren,
  classes: Object
}

const styles = theme => ({
  menu: {
    display: 'none',
    listStyleType: 'none',
    fontSize: theme.navFontSize
  },
  [theme.breakpoints.mdQuery]: {
    menu: {
      display: 'flex',
      alignItems: 'center'
    }
  },
  menuItem: {
    color: theme.navMenuTextColor,
    marginLeft: '2rem'
  }
})

const DesktopMenu = ({children, classes}) => {
  return (
    <ul className={classes.menu}>
      { children }
    </ul>
  )
}

const DesktopMenuItem = ({children, classes}) => {
  return (
    <li className={classes.menuItem}>
      { children }
    </li>
  )
};

const StyledDesktopMenu = injectSheet(styles)(DesktopMenu);
const StyledDesktopMenuItem = injectSheet(styles)(DesktopMenuItem);

export {
  StyledDesktopMenu as DesktopMenu,
  StyledDesktopMenuItem as DesktopMenuItem
};