import React from 'react';
import injectSheet, { WithStylesProps } from 'react-jss';
import { Trans } from 'react-i18next';

const styles = (theme: any) => ({
  inner: {
    // TODO: Used in the code but not defined in styles?
  },
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
  menuList: {
    listStyleType: 'none',
    background: theme.headerMainAreaColor,
    position: 'absolute',
    border: `1px solid ${theme.borderColor}`,
    marginTop: '1rem',
    boxShadow: '0 .5rem 1rem rgba(0,0,0, .2)',
    width: '28rem',
    right: '0',
    zIndex: '10',
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

interface IProps extends WithStylesProps<typeof styles> {
  placeholder?: string;
}

interface IState {
  open: boolean;
}

class MobileMenu extends React.Component<IProps, IState> {
  wrapperRef: any;

  constructor(props: IProps) {
    super(props);
    this.state = { open: false };

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKey = this.handleKey.bind(this);
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
    this.wrapperRef = node;
  }

  handleKey(event: any) {
    if (event.key === ' ' || event.key === 'Enter') {
      this.setState({ open: !this.state.open });
    }
  }

  handleClick() {
    this.setState({ open: !this.state.open });
  }

  handleClickOutside(event: any) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ open: false });
    }
  }

  render() {
    const { classes, placeholder } = this.props;
    return (
      <nav className={classes.mobileMenu}>
        <div
          className={classes.inner}
          ref={this.setWrapperRef}
          onClick={this.handleClick}
          onKeyDown={this.handleKey}
          tabIndex={0}
          role="button"
          aria-haspopup="true"
        >
          {placeholder ? placeholder : <Trans>general.menu</Trans>}
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
