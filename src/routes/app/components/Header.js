/* @flow */
import * as React from 'react';
import injectSheet from 'react-jss';
import Link from 'components/link';
import LanguageToggler from './LanguageToggler';
import { Trans } from 'react-i18next';;
import { DesktopMenu, DesktopMenuItem } from './DesktopMenu';
import { MobileMenu, MobileMenuItem } from './MobileMenu';
import { H1 } from 'components/text';

const styles = theme => ({
  logoBar: {
    margin: '0 auto',
    maxWidth: theme.appMaxWidth,
    padding: `0 ${theme.horizontalPadding}`,
    [`@media (min-width: ${theme.breakpoints.lg})`]: {
      padding: `0 ${theme.horizontalMdPadding}`
    },
  },
  logoBarWrapper: {
    backgroundColor: theme.colors.black
  },
  logo: {
    background: 'url("/uio-app-logo-nb.png") left center no-repeat',
    height: '4rem'
  },
  mainWrapper: {
    backgroundColor: theme.headerMainAreaColor
  },
  main: {
    margin: '0 auto',
    maxWidth: theme.appMaxWidth,
    height: '12rem',
    padding: `2.5rem ${theme.horizontalPadding} 3rem ${theme.horizontalPadding}`,
    [`@media (min-width: ${theme.breakpoints.lg})`]: {
      padding: `2.5rem ${theme.horizontalMdPadding} 3rem ${theme.horizonalMdPadding}`
    },
  },
  mainRow: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.white
  },
  desc: {
    fontSize: '1.7rem',
    lineHeight: '1.5',
    color: theme.colors.eggWhite,
    marginTop: '0.5rem',
    [`@media (min-width: ${theme.breakpoints.lg})`]: {
      fontSize: '2rem'
    },
  },

})

type Props = {
  logoutAction: Function,
  classes: Object
}

const Header = ({ logoutAction, classes }: Props) => {
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
              <H1>eValg</H1>
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
                <a onClick={() => console.error('LOGOUT')}>
                  <Trans>general.logout</Trans>
                </a>
              </MobileMenuItem>
            </MobileMenu>
            <DesktopMenu>
              <DesktopMenuItem>Forsiden</DesktopMenuItem>
              <DesktopMenuItem><LanguageToggler /></DesktopMenuItem>
            </DesktopMenu>
          </div>
          <div className={classes.mainRow}>
            <p className={classes.desc}>Elektronisk valg</p>
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
  )
};

export default injectSheet(styles)(Header);