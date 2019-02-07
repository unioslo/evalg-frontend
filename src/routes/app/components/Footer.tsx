import * as React from 'react';
import injectSheet from 'react-jss';
import { testWarning } from 'appConfig';
import { Trans, translate } from 'react-i18next';

import Link from 'components/link';

const contactEmail = 'noe@usit.uio.no';

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
      height: '8rem',
      padding: `0rem ${theme.horizontalMdPadding}`,
      background: `url('/uio-app-uio-sickle-medium.png') left ${
        theme.horizontalMdPadding
      } top no-repeat`,
    },
  },
  logoOffsetContainer: {
    paddingLeft: '8rem',
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
      '&:not(:first-child)': {
        marginLeft: '5rem',
      },
      '&:not(:last-child)': {
        marginBottom: 0,
      },
    },
    '& header': {
      fontSize: '1.8rem',
      marginBottom: '2rem',
    },
    '& .content': {
      fontSize: '1.5rem',
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
                  <Link mail to={contactEmail} inheritColor>
                    {contactEmail}
                  </Link>
                </div>
              </section>
              <section className={classes.footerSection}>
                <header>
                  <Trans>footer.responsibleOrganizationHeader</Trans>
                </header>
                <div className="content">Ansvarlig enhet</div>
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
