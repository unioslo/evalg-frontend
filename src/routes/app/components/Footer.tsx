import React from 'react';
import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';
import { Trans, useTranslation } from 'react-i18next';

import {
  appInst,
  appStagingWarning,
  appServiceOwnerLink,
  appTechnicalSupportLink,
  appTechnicalSupportMail,
  appPrivacyPolicylink,
  appCookiesInformationLink,
  isSupplier,
} from 'appConfig';
import Link from 'components/link';

const useStyles = createUseStyles((theme: any) => ({
  wrapper: {
    background: theme.footerBackgroundColor,
    padding: '4rem 0',
  },
  footer: {
    background:
      appInst === 'uio' || appInst === undefined
        ? `url('/uio-app-uio-sickle-medium.png') left ${theme.horizontalPadding} top no-repeat`
        : 'none',
    height: 'fit-content',
    maxWidth: theme.appMaxWidth,
    margin: '0 auto',
    padding: `0rem ${theme.horizontalPadding}`,
    [theme.breakpoints.mdQuery]: {
      minHeight: '8rem',
      padding: `0rem ${theme.horizontalMdPadding}`,
      background:
        appInst === 'uio' || appInst === undefined
          ? `url('/uio-app-uio-sickle-medium.png') left ${theme.horizontalMdPadding} top no-repeat`
          : 'none',
    },
  },
  logoOffsetContainer: {
    paddingLeft: '10rem',
  },
  contentContainer: {
    width: 'fit-content',
    color: theme.footerTextColor,
    [theme.breakpoints.mdQuery]: {
      display: 'flex',
      width: 'initial',
      flexWrap: 'nowrap',
      margin: 0,
    },
  },
  divider: {
    borderTop: `1px solid ${theme.headerTitleColor}`,
  },
  footerBackground: {
    backgroundImage: 'url("hiof/footer.svg")',
    backgroundSize: 'cover',
    backgroundColor: theme.footerBackgroundColor,
    width: '100%',
    paddingTop: '34.7%',
  },
  footerSection: {
    '&:not(:last-child)': {
      marginBottom: '3rem',
    },
    [theme.breakpoints.mdQuery]: {
      width: '30%',
      '&:not(:first-child)': {
        marginLeft: '5%',
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
}));

const Footer: React.FunctionComponent = () => {
  const { i18n, t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const logoOffsetClass = classNames({
    [classes.logoOffsetContainer]: appInst === 'uio',
  });

  return (
    <>
      {appInst === 'khio' && <hr className={classes.divider} />}
      <footer className={classes.wrapper}>
        <div className={classes.footer}>
          <div className={logoOffsetClass}>
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
                    {appTechnicalSupportLink ? (
                      <Link
                        external
                        to={appTechnicalSupportLink}
                        inheritColor
                        underline
                      >
                        {t('footer.contactHelp')}
                      </Link>
                    ) : (
                      <Link
                        mail
                        to={appTechnicalSupportMail}
                        inheritColor
                        underline
                      >
                        {t('footer.contactHelpMail')}
                      </Link>
                    )}
                  </div>
                </div>
              </section>
              <section className={classes.footerSection}>
                <header>
                  {isSupplier
                    ? t('footer.responsibleSupplierHeader')
                    : t('footer.responsibleOrganizationHeader')}
                </header>
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
      {appInst === 'hiof' && <div className={classes.footerBackground} />}
      {appStagingWarning && (
        <div className="alert">
          <Trans
            components={[
              <a href="https://valg2.uio.no">text</a>,
              <a href="https://www.uio.no/tjenester/it/adm-app/e-valg/evalg3.html">
                text
              </a>,
            ]}
          >
            footer.pilotMessage
          </Trans>
        </div>
      )}
    </>
  );
};

export default Footer;
