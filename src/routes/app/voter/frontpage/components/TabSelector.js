/* @flow */
import * as React from 'react';
import classNames from 'classnames';

type Props = {
  children: ReactChildren
}

const TabSelector = (props: Props) => {
  return (
    <ul className="tabselector">
      {props.children}
    </ul>
  )
};

type TabProps = {
  text: string,
  onClick: Function,
  active?: boolean
}

const Tab = (props: TabProps) => {
  const cls = classNames({
    'tabselector--tab': true,
    'tabselector--tab-active': props.active
  });
  return (
    <li className={cls} onClick={props.onClick}>
      {props.text}
    </li>
  )
};

export { TabSelector, Tab }