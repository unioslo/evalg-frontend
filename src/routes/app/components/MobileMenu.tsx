import * as React from 'react';
import injectSheet from 'react-jss';
import { Trans } from 'react-i18next';
import { Classes } from 'jss';

const styles = (theme: any) => ({
  mobileMenu: {
    color: theme.navMenuTextColor,
    fontSize: theme.navFontSize,
    display: 'flex',
    alignItems: 'center',
  },
  [theme.breakpoints.mdQuery]: {
    mobileMenu: {
      display: 'none',
    },
  },
  mobileMenuInner: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.5rem',
  },
  menuIcon: {
    display: 'block',
    marginLeft: '0.5rem',
    width: '2rem',
    height: '3rem',
    cursor: 'pointer',
    '&:after': {
      content: '',
      display: 'block',
      width: '20px',
      height: '4px',
      background: theme.navMenuTextColor,
      marginTop: '0.3rem',
      boxShadow: `0px 8px 0px ${theme.white}, 0px 16px 0px ${theme.white}`,
    },
  },
  menuList: {
    listStyleType: 'none',
    background: theme.headerMainAreaColor,
    position: 'absolute',
    border: `1px solid ${theme.borderColor}`,
    top: '3rem',
    width: '28rem',
    right: '0',
  },
  menuListItem: {
    borderTop: `1px solid ${theme.borderColor}`,
    lineHeight: '2',
    paddingLeft: '1.5rem',
    '&:first-child': {
      borderTop: 'none',
    },
  },
});

interface IProps {
  classes: Classes;
}

interface IState {
  open: boolean;
  wrapperRef: any;
}

class MobileMenu extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { open: false, wrapperRef: null };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener(
      'mousedown',
      this.handleClickOutside.bind(this)
    );
  }

  setWrapperRef(node: any) {
    this.setState({ wrapperRef: node });
  }

  handleClick() {
    this.setState({ open: !this.state.open });
  }

  handleClickOutside(event: any) {
    if (
      this.state.wrapperRef &&
      !this.state.wrapperRef.contains(event.target)
    ) {
      this.setState({ open: false });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <nav className={classes.mobileMenu}>
        <div
          className={classes.inner}
          ref={this.setWrapperRef}
          onClick={this.handleClick}
        >
          <Trans>general.menu</Trans>
          <div className={classes.menuIcon} />
          {this.state.open && (
            <ul className={classes.menuList}>{this.props.children}</ul>
          )}
        </div>
      </nav>
    );
  }
}

const MobileMenuItem: React.FunctionComponent<IProps> = ({
  children,
  classes,
}) => {
  return <li className={classes.menuListItem}>{children}</li>;
};

const StyledMobileMenu = injectSheet(styles)(MobileMenu);
const StyledMobileMenuItem = injectSheet(styles)(MobileMenuItem);

export {
  StyledMobileMenu as MobileMenu,
  StyledMobileMenuItem as MobileMenuItem,
};
