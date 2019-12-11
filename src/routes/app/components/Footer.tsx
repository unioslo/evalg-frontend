import React from 'react';
import injectSheet from 'react-jss';
import { Trans, useTranslation } from 'react-i18next';

import {
  appStagingWarning,
  appServiceOwnerLink,
  appTechnicalSupportEmail,
  appPrivacyPolicylink,
  appCookiesInformationLink,
} from 'appConfig';
import Link from 'components/link';

const styles = (theme: any) => ({
  wrapper: {
    background: theme.colors.black,
    padding: '4rem 0',
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
      marginBottom: '1.5rem',
    },
    '& .content': {
      fontSize: '1.4rem',
      lineHeight: '2rem',
      '& :not(:last-child)': {
        marginBottom: '0.5rem',
      },
    },
  },
});

interface IProps {
  classes: any;
}

const Footer: React.FunctionComponent<IProps> = (props: IProps) => {
  const { classes } = props;
  const { i18n, t } = useTranslation();

  return (
    <React.Fragment>
      <footer className={classes.wrapper}>
        <div className={classes.footer}>
          <div className={classes.logoOffsetContainer}>
            <div className={classes.contentContainer}>
              <section className={classes.footerSection}>
                <header>{t('footer.termsHeader')}</header>
                <div className="content">
                  <div>
                    <Link
                      external
                      noExternalIcon
                      inheritColor
                      underline
                      to={appPrivacyPolicylink[i18n.language]}
                    >
                      {t('footer.privacyPolicyLink')}
                    </Link>
                  </div>
                  <div>
                    {t('footer.evalgUses')}{' '}
                    <Link
                      external
                      noExternalIcon
                      inheritColor
                      underline
                      to={appCookiesInformationLink[i18n.language]}
                    >
                      {t('footer.cookiesInformationLink')}
                    </Link>
                  </div>
                </div>
              </section>
              <section className={classes.footerSection}>
                <header>{t('footer.contactSectionHeader')}</header>
                <div className="content">
                  <div>
                    {t('footer.technicalSupport')}:{' '}
                    <Link
                      mail
                      to={appTechnicalSupportEmail}
                      inheritColor
                      underline
                    >
                      {appTechnicalSupportEmail}
                    </Link>
                  </div>
                </div>
              </section>
              <section className={classes.footerSection}>
                <header>{t('footer.responsibleOrganizationHeader')}</header>
                <div className="content">
                  <div>
                    <Link
                      external
                      noExternalIcon
                      inheritColor
                      underline
                      to={appServiceOwnerLink}
                    >
                      {t('footer.serviceOwnerLink')}
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </footer>
      {appStagingWarning && (
        <div className="alert">
          <Trans
            components={[
              <a href="https://valg2.uio.no">text</a>,
              <a href="https://www.uio.no/tjenester/it/adm-app/e-valg/evalg3.html">text</a>
            ]}
          >
            footer.pilotMessage
          </Trans>
        </div>
      )}
    </React.Fragment>
  );
};

export default injectSheet(styles)(Footer);
