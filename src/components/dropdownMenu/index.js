/* @flow */
import * as React from 'react';
import classNames from 'classnames';
//import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import DropDownBase from 'components/baseComponents/DropDownBase';

type Props = {
  children: ReactChildren,
  text: string | ReactElement,
  largeArrow?: boolean
}

class MobileDropDown extends DropDownBase {
  props: Props;

  render() {
    const { text } = this.props;
    const innerClassNames = classNames({
      'dropdownmenu--inner': true,
      'dropdownmenu--inner-largearrow': this.props.largeArrow
    });
    return (
      <nav className="dropdownmenu">
        <div className={innerClassNames}
          ref={(node) => (this.wrapperRef = node)}
          onClick={this.handleClick.bind(this)}>
          {text}
          {/* <ReactCSSTransitionGroup
            transitionName="fade-in-and-out"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            {this.state.open &&
            <ul className="dropdownmenu--inner--list">
              { this.props.children }
            </ul>
            }
          </ReactCSSTransitionGroup> */}
        </div>
      </nav>
    )
  }
}

type ItemProps = {
  children: ReactChildren,
  onClick: Function,
  active: boolean
}

const MobileDropdownItem = (props: ItemProps) => {
  const cls = classNames({
    'dropdownmenu--inner--list--item': true,
    'dropdownmenu--inner--list--item-active': props.active,
  });
  return (
    <li className={cls}
      onClick={props.onClick}>
      {props.children}
    </li>
  )
};

export { MobileDropDown, MobileDropdownItem };