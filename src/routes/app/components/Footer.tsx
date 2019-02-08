import * as React from 'react';
import injectSheet from 'react-jss';
import { Trans, translate } from 'react-i18next';

import {
  testWarning,
  appHoldingElectionsInfoLink,
  appServiceOwnerLink,
  appTechnicalSupportEmail,
} from 'appConfig';
import Link from 'components/link';

const styles = (theme: any) => ({
  wrapper: {
    background: theme.colors.black,
    padding: '3.5rem 0',
  },
  footer: {
    background: `url('/uio-app-uio-sickle-medium.png') left ${
      theme.horizontalPadding
    } top no-repeat`,
    height: 'fit-content',
    maxWidth: theme.appMaxWidth,
    margin: '0 auto',
    padding: `0rem ${theme.horizontalPadding}`,
    [theme.breakpoints.mdQuery]: {
      minHeight: '8rem',
      padding: `0rem ${theme.horizontalMdPadding}`,
      background: `url('/uio-app-uio-sickle-medium.png') left ${
        theme.horizontalMdPadding
      } top no-repeat`,
    },
  },
  logoOffsetContainer: {
    paddingLeft: '10rem',
  },
  contentContainer: {
    width: 'fit-content',
    margin: '0 auto',
    color: 'white',
    [theme.breakpoints.mdQuery]: {
      display: 'flex',
      width: 'initial',
      flexWrap: 'nowrap',
      justifyContent: 'flex-end',
      paddingRight: '5rem',
      margin: 0,
    },
  },
  footerSection: {
    '&:not(:last-child)': {
      marginBottom: '3rem',
    },
    [theme.breakpoints.mdQuery]: {
      width: '21rem',
      '&:not(:first-child)': {
        marginLeft: '5rem',
      },
      '&:not(:last-child)': {
        marginBottom: 0,
      },
    },
    '& header': {
      fontSize: '2rem',
      marginBottom: '2rem',
    },
    '& .content': {
      fontSize: '1.4rem',
      lineHeight: '2rem',
      '& div:not(:last-child)': {
        marginBottom: '1rem',
      },
    },
  },
});

interface IProps {
  classes: any;
}

const Footer = (props: IProps) => {
  const { classes } = props;

  return (
    <React.Fragment>
      <footer className={classes.wrapper}>
        <div className={classes.footer}>
          <div className={classes.logoOffsetContainer}>
            <div className={classes.contentContainer}>
              <section className={classes.footerSection}>
                <header>
                  <Trans>footer.contactSectionHeader</Trans>
                </header>
                <div className="content">
                  <div>
                    <Trans>footer.technicalSupport</Trans>:{' '}
                    <Link
                      mail
                      to={appTechnicalSupportEmail}
                      inheritColor
                      underline
                    >
                      {appTechnicalSupportEmail}
                    </Link>
                  </div>
                  <div>
                    <Link
                      external
                      noExternalIcon
                      inheritColor
                      underline
                      to={appHoldingElectionsInfoLink}
                    >
                      <Trans>footer.holdingElectionsInfoLink</Trans>
                    </Link>
                  </div>
                </div>
              </section>
              <section className={classes.footerSection}>
                <header>
                  <Trans>footer.responsibleOrganizationHeader</Trans>
                </header>
                <div className="content">
                  <Link
                    external
                    noExternalIcon
                    inheritColor
                    underline
                    to={appServiceOwnerLink}
                  >
                    <Trans>footer.serviceOwnerLink</Trans>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </footer>
      {testWarning && (
        <div className="alert">
          Test av evalg 3. For spørsmål om løsningen ta kontakt med{' '}
          <a href="mailto:evalg-kontakt@usit.uio.no">evalg-drift</a>
        </div>
      )}
    </React.Fragment>
  );
};

export default translate()(injectSheet(styles)(Footer));
