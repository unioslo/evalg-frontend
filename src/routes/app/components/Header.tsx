import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { ApolloConsumer, Query } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router';
import { IAuthenticatorContext } from 'react-oidc/lib/makeAuth';
import { History } from 'history';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import { appHelpLink } from 'appConfig';
import Link from 'components/link';
import { H1 } from 'components/text';
import { UserContext } from 'providers/UserContext';

import LanguageToggler from './LanguageToggler';
import { DesktopMenu, DesktopMenuItem } from './DesktopMenu';
import { MobileMenu, MobileMenuItem } from './MobileMenu';
import { getSignedInPersonDisplayName } from 'queries';
import ApolloClient from 'apollo-client';

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
  mobileLanguageToggler: {
    color: theme.navMenuTextColor,
    fontSize: theme.navFontSize,
    [theme.breakpoints.mdQuery]: {
      display: 'none',
    },
  },
});

const sayMyName = gql`
  query {
    viewer {
      person {
        id
        displayName
      }
    }
  }
`;

interface IProps {
  history: History;
  classes: Classes;
}

const Header: React.FunctionComponent<IProps> = (props: IProps) => {
  const { history, classes } = props;
  const { t } = useTranslation();

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
                    <Link to="/" inheritColor noUnderline>
                      <H1>eValg</H1>
                    </Link>
                  )}
                />
              </Switch>
            </div>
            <MobileMenu>
              <MobileMenuItem>
                <Switch>
                  <Route
                    path="/admin"
                    render={() => (
                      <Link to="/" inheritColor>
                        {t('general.frontPage')}
                      </Link>
                    )}
                  />
                  <Route
                    path="/"
                    render={() => (
                      <Link to="/admin" inheritColor>
                        {t('general.administerElections')}
                      </Link>
                    )}
                  />
                </Switch>
              </MobileMenuItem>
              <MobileMenuItem>
                <Link inheritColor external noExternalIcon to={appHelpLink}>
                  {t('general.help')}
                </Link>
              </MobileMenuItem>
              <MobileMenuItem>
                <MobileLogout history={history} />
              </MobileMenuItem>
            </MobileMenu>
            <DesktopMenu>
              <DesktopMenuItem>
                <Switch>
                  <Route
                    path="/admin"
                    render={() => (
                      <Link to="/" inheritColor>
                        {t('general.frontPage')}
                      </Link>
                    )}
                  />
                  <Route
                    path="/"
                    render={() => (
                      <Link to="/admin" inheritColor>
                        {t('general.administerElections')}
                      </Link>
                    )}
                  />
                </Switch>
              </DesktopMenuItem>
              <DesktopMenuItem>
                <Link inheritColor external noExternalIcon to={appHelpLink}>
                  {t('general.help')}
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
                    {t('general.headerSubtitleAdmin')}
                  </p>
                )}
              />
              <Route
                path="/"
                render={() => (
                  <p className={classes.desc}>
                    {t('general.headerSubtitleVoter')}
                  </p>
                )}
              />
            </Switch>
            <DesktopMenu>
              <ApolloConsumer>
                {client => (
                  <UserNameAndLogout history={history} apolloClient={client} />
                )}
              </ApolloConsumer>
            </DesktopMenu>
            <div className={classes.mobileLanguageToggler}>
              <LanguageToggler />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const navigateToLogout = (history: History) => {
  history.push('/logout');
};

const MobileLogout: React.FunctionComponent<{ history: History }> = ({
  history,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <UserContext.Consumer>
        {context => {
          if (context.user) {
            return (
              <MobileMenuItem>
                <a
                  onClick={e => {
                    e.preventDefault();
                    navigateToLogout(history);
                  }}
                  href="/"
                >
                  {t('general.logout')}
                </a>
              </MobileMenuItem>
            );
          } else {
            return null;
          }
        }}
      </UserContext.Consumer>
    </>
  );
};

const UserNameAndLogout: React.FunctionComponent<{
  apolloClient: ApolloClient<any>;
  history: History;
}> = ({ apolloClient, history }) => {
  const { t } = useTranslation();
  const [userDisplayName, setUserDisplayName] = useState('');

  useEffect(() => {
    const getDisplayName = async () => {
      let displayName;
      try {
        displayName = await getSignedInPersonDisplayName(apolloClient);
        setUserDisplayName(displayName);
      } catch (error) {
        console.error('Could not get ID of signed in user.');
      }
    };
    getDisplayName();
  }, []);

  return (
    <ApolloConsumer>
      {client => {
        return (
          <UserContext.Consumer>
            {context => {
              if (context.user) {
                return (
                  <>
                    <DesktopMenuItem>
                      {userDisplayName}
                    </DesktopMenuItem>
                    <DesktopMenuItem>
                      <a
                        style={{ color: 'inherit' }}
                        onClick={e => {
                          e.preventDefault();
                          navigateToLogout(history);
                        }}
                        href="/"
                      >
                        {t('general.logout')}
                      </a>
                    </DesktopMenuItem>
                  </>
                );
              } else {
                return null;
              }
            }}
          </UserContext.Consumer>
        );
      }}
    </ApolloConsumer>
  );
};

export default injectSheet(styles)(Header);
