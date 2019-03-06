/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

const styles = (theme: any) => ({
  tab: {
    '&:hover': {
      cursor: 'pointer'
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '4.4rem',
    width: '15rem',
    borderBottom: `2px solid ${theme.eggWhite}`,
  },
  tabActive: {
    background: theme.colors.lightBlueGray,
    borderBottom: `2px solid ${theme.darkBlueish}`
  },
  tabSelector: {
    background: theme.colors.whiteGray,
    listStyleType: 'none',
    display: 'inline-flex',
    fontSize: '1.5rem',
  }
})


interface IProps {
  children: React.ReactNode;
  classes: Classes;
}

const TabSelector: React.SFC<IProps> = (props) => {
  return (
    <ul className={props.classes.tabSelector}>
      {props.children}
    </ul>
  )
};


interface ITabProps {
  text: string | React.ReactElement;
  onClick: () => void;
  active?: boolean;
  classes: Classes;
}

const Tab: React.SFC<ITabProps> = (props) => {
  const cls = classNames({
    [props.classes.tab]: true,
    [props.classes.tabActive]: props.active
  });
  return (
    <li className={cls} onClick={props.onClick}>
      {props.text}
    </li>
  )
};


const StyledTab = injectSheet(styles)(Tab);
const StyledTabSelector = injectSheet(styles)(TabSelector);
export { StyledTab as Tab, StyledTabSelector as TabSelector }