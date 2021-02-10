import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import Link from 'components/link';
import { MsgBox } from 'components/msgbox';
import { showUserMsg } from 'appConfig';

const styles = (theme: any) => ({
  mainContainer: {
    display: 'flex',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    maxWidth: '450px',
    flexDirection: 'column',
    [theme.breakpoints.mdQuery]: {
      width: '740px',
      maxWidth: 'none',
      height: '450px',
      marginTop: '2rem',
      flexDirection: 'row',
    },
  },
  graphicDesktop: {
    display: 'none',
    [theme.breakpoints.mdQuery]: {
      display: 'block',
    },
  },
  graphicMobile: {
    display: 'block',
    width: '100%',
    [theme.breakpoints.mdQuery]: {
      display: 'none',
    },
  },
  mainContentDesktop: {
    display: 'none',
    [theme.breakpoints.mdQuery]: {
      display: 'flex',
    },
    flexDirection: 'column',
    margin: '0 auto',
    justifyContent: 'center',
    width: '30rem',
  },
  mainContentMobile: {
    display: 'flex',
    [theme.breakpoints.mdQuery]: {
      display: 'none',
    },
    flexDirection: 'column',
    padding: '2rem',
  },
  header: {
    marginBottom: '2rem',
    fontWeight: 'normal',
    fontSize: '3.2rem',
    lineHeight: '4rem',
  },
  featuresList: {
    listStyle: 'none',
    lineHeight: '2.6rem',
    [theme.breakpoints.mdQuery]: {
      marginBottom: '2.5rem',
    },
    '& li::before': {
      content: '""',
      width: '0.6rem',
      height: '0.6rem',
      backgroundColor: 'gray',
      display: 'inline-block',
      marginBottom: '0.3rem',
      marginRight: '1.8rem',
    },
  },
  loginButton: {
    display: 'flex',
    minWidth: '200px',
    justifyContent: 'center',
    alignItems: 'center',
    height: '40px',
    backgroundColor: 'black',
    color: 'white',
    border: '0 solid',
    borderRadius: '4px',
    marginBottom: '2rem',
  },
  textContentMobile: {
    margin: '2rem 0',
  },
  linksDesktop: {
    lineHeight: '2.6rem',
    '& a': {
      display: 'block',
      marginBottom: '1rem',
    },
  },
});

interface IProps {
  classes: Classes;
}

const FrontPage: React.FunctionComponent<IProps> = ({ classes }) => {
  const { t } = useTranslation();

  return (
    <>
      {showUserMsg && (
        <MsgBox
          msg={
            <Trans t={t} components={[<a href="https://valg2.uio.no">text</a>]}>
              loginPage.message
            </Trans>
          }
          timeout={false}
          small
          warning
        />
      )}
      <div className={classes.mainContainer}>
        <img
          className={classes.graphicDesktop}
          src="/loginpage-graphic-desktop.svg"
          alt=""
        />
        <img
          className={classes.graphicMobile}
          src="/loginpage-graphic-mobile.svg"
          alt=""
        />
        <div className={classes.mainContentDesktop}>
          <h1 className={classes.header}>{t('loginPage.header')}</h1>
          <ul className={classes.featuresList}>
            <li>{t('loginPage.featureList1')}</li>
            <li>{t('loginPage.featureList2')}</li>
            <li>{t('loginPage.featureList3')}</li>
          </ul>
          <RouterLink className={classes.loginButton} to="/login">
            {t('loginPage.loginButton')}
          </RouterLink>
          <div className={classes.linksDesktop}>
            <Link to="/admin" underline>
              {t('loginPage.loginAsAdmin')}
            </Link>
            <Link
              to="https://www.uio.no/tjenester/it/adm-app/e-valg/"
              underline
              external
              noExternalIcon
            >
              {t('loginPage.readMore')}
            </Link>
          </div>
        </div>
        <div className={classes.mainContentMobile}>
          <RouterLink className={classes.loginButton} to="/login">
            {t('loginPage.loginButton')}
          </RouterLink>
          <Link to="/admin" underline>
            {t('loginPage.loginAsAdmin')}
          </Link>
          <div className={classes.textContentMobile}>
            <h1 className={classes.header}>{t('loginPage.header')}</h1>
            <ul className={classes.featuresList}>
              <li>{t('loginPage.featureList1')}</li>
              <li>{t('loginPage.featureList2')}</li>
              <li>{t('loginPage.featureList3')}</li>
            </ul>
          </div>
          <Link to="#" underline external noExternalIcon>
            {t('loginPage.readMore')}
          </Link>
        </div>
      </div>
    </>
  );
};

export default injectSheet(styles)(FrontPage);
