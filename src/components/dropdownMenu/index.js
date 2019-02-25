/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import DropDownBase from 'components/baseComponents/DropDownBase';

const styles = theme => ({
  container: {
    color: theme.colors.greyishBrown,
    fontSize: theme.navFontSize,
    display: 'flex',
    alignItems: 'center'
  },
  dropDownMenu: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: 'url("/dropdownarrow.svg") no-repeat right 0 top 40%',
    paddingRight: '2rem',
  },
  largeArrow: {
    backgroundSize: '19px auto',
    paddingRight: '2.7rem',
  },
  menuList: {
    listStyleType: 'none',
    background: theme.colors.white,
    position: 'absolute',
    border: `2px solid ${theme.borderColor}`,
    top: '3rem',
    width: '28rem',
    right: 0,
    left: 0
  },
  listItem: {
    '&:first-child': {
      borderTop: 'none'
    },
    borderTop: `1px solid ${theme.borderColor}`,
    lineHeight: 3.89,
    paddingLeft: '1.5rem',
  },
  listItemActive: {
    background: theme.colors.lightBlueGray
  }
});

type Props = {
  children: ReactChildren,
  text: string | ReactElement,
  largeArrow?: boolean,
  classes: Object
}

class MobileDropDown extends DropDownBase {
  props: Props;

  render() {
    const { text } = this.props;
    const { classes } = this.props;
    const dropDownClasses = classNames({
      [classes.dropDownMenu]: true,
      [classes.largeArrow]: this.props.largeArrow
    });
    return (
      <nav className={classes.container}>
        <div className={dropDownClasses}
          ref={(node) => (this.wrapperRef = node)}
          onClick={this.handleClick.bind(this)}>
          {text}
          <TransitionGroup>
            <CSSTransition
              classNames="fade-in-and-out"
              timeout={{ enter: 500, exit: 300 }}
            >
              <div>
                {this.state.open &&
                  <ul className={classes.menuList}>
                    {this.props.children}
                  </ul>
                }
              </div>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </nav>
    )
  }
}

const StyledMobileDropDown = injectSheet(styles)(MobileDropDown);

type ItemProps = {
  children: ReactChildren,
  onClick: Function,
  active: boolean,
  classes: Object
}

const MobileDropdownItem = (props: ItemProps) => {
  const cls = classNames({
    [props.classes.listItem]: true,
    [props.classes.listItemActive]: props.active,
  });
  return (
    <li className={cls}
      onClick={props.onClick}>
      {props.children}
    </li>
  )
};

const StyledMobileDropdownItem = injectSheet(styles)(MobileDropdownItem);

export {
  StyledMobileDropDown as MobileDropDown,
  StyledMobileDropdownItem as MobileDropdownItem
};