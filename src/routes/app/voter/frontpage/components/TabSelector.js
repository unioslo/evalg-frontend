/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

const styles = theme => ({
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


type Props = {
  children: ReactChildren,
  classes: Object
}

const TabSelector = (props: Props) => {
  return (
    <ul className={props.classes.tabSelector}>
      {props.children}
    </ul>
  )
};

const StyledTabSelector = injectSheet(styles)(TabSelector);

type TabProps = {
  text: string,
  onClick: Function,
  active?: boolean,
  classes: Object
}

const Tab = (props: TabProps) => {
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

export { StyledTab as Tab, StyledTabSelector as TabSelector }