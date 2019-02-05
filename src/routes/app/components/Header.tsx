import * as React from 'react';
import injectSheet from 'react-jss';
import Link from 'components/link';
import LanguageToggler from './LanguageToggler';
import { Trans, translate } from 'react-i18next';
import { DesktopMenu, DesktopMenuItem } from './DesktopMenu';
import { MobileMenu, MobileMenuItem } from './MobileMenu';
import { H1 } from 'components/text';
import { Route, Switch } from 'react-router';

const styles = (theme: any) => ({
  logoBar: {
    margin: '0 auto',
    maxWidth: theme.appMaxWidth,
    padding: `0 ${theme.horizontalPadding}`,
    [theme.breakpoints.mdQuery]: {
      padding: `0 ${theme.horizontalMdPadding}`,
    },
  },
  logoBarWrapper: {
    backgroundColor: theme.colors.black,
  },
  logo: {
    background: 'url("/uio-app-logo-nb.png") left center no-repeat',
    height: '4rem',
  },
  mainWrapper: {
    backgroundColor: theme.headerMainAreaColor,
  },
  main: {
    margin: '0 auto',
    maxWidth: theme.appMaxWidth,
    height: '12rem',
    padding: `2.5rem ${theme.horizontalPadding} 3rem ${
      theme.horizontalPadding
    }`,
    [theme.breakpoints.mdQuery]: {
      padding: `2.5rem ${theme.horizontalMdPadding} 3rem ${
        theme.horizontalMdPadding
      }`,
    },
  },
  mainRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  desc: {
    fontSize: '1.7rem',
    lineHeight: '1.5',
    color: theme.colors.eggWhite,
    marginTop: '0.5rem',
    [theme.breakpoints.mdQuery]: {
      fontSize: '2rem',
    },
  },
});

interface IProps {
  logoutAction: () => void;
  classes?: any;
}

const Header = ({ logoutAction, classes }: IProps) => {
  return (
    <header>
      <div className={classes.logoBarWrapper}>
        <div className={classes.logoBar}>
          <div className={classes.logo} />
        </div>
      </div>
      <div className={classes.mainWrapper}>
        <div className={classes.main}>
          <div className={classes.mainRow}>
            <div className={classes.title}>
              <Switch>
                <Route
                  path="/admin"
                  render={() => (
                    <Link to="/admin" inheritColor noUnderline>
                      <H1>eValg</H1>
                    </Link>
                  )}
                />
                <Route
                  path="/"
                  render={() => (
                    <Link to="/voter" inheritColor noUnderline>
                      <H1>eValg</H1>
                    </Link>
                  )}
                />
              </Switch>
            </div>
            <MobileMenu>
              <MobileMenuItem>
                <Link to="/admin">Admin page!</Link>
              </MobileMenuItem>
              <MobileMenuItem>
                <Link to="/voter">Voter page!</Link>
              </MobileMenuItem>
              <MobileMenuItem>OMGLOL</MobileMenuItem>
              <MobileMenuItem>
                <a onClick={logoutAction}>
                  <Trans>general.logout</Trans>
                </a>
              </MobileMenuItem>
            </MobileMenu>
            <DesktopMenu>
              <DesktopMenuItem>
                <Link inheritColor to="/">
                  <Trans>general.frontPage</Trans>
                </Link>
              </DesktopMenuItem>
              <DesktopMenuItem>
                <LanguageToggler />
              </DesktopMenuItem>
            </DesktopMenu>
          </div>
          <div className={classes.mainRow}>
            <Switch>
              <Route
                path="/admin"
                render={() => (
                  <p className={classes.desc}>
                    <Trans>general.headerSubtitleAdmin</Trans>
                  </p>
                )}
              />
              <Route
                path="/"
                render={() => (
                  <p className={classes.desc}>
                    <Trans>general.headerSubtitleVoter</Trans>
                  </p>
                )}
              />
            </Switch>
            <DesktopMenu>
              <DesktopMenuItem>Zaphod Beeblebrox</DesktopMenuItem>
              <DesktopMenuItem>
                <a onClick={logoutAction}>
                  <Trans>general.logout</Trans>
                </a>
              </DesktopMenuItem>
            </DesktopMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default injectSheet(styles)(translate()(Header));
