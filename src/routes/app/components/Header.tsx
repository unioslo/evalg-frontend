import * as React from 'react';
import gql from 'graphql-tag';
import injectSheet from 'react-jss';
import Link from 'components/link';
import LanguageToggler from './LanguageToggler';
import { Trans, translate } from 'react-i18next';
import { DesktopMenu, DesktopMenuItem } from './DesktopMenu';
import { MobileMenu, MobileMenuItem } from './MobileMenu';
import { UserContext } from 'providers/UserContext';
import { H1 } from 'components/text';
import { Query } from 'react-apollo';
import { Route, Switch } from 'react-router';

import { ApolloConsumer } from 'react-apollo';
import { IAuthenticatorContext } from 'react-oidc/lib/makeAuth';
import { ApolloClient } from 'apollo-client';
import createBrowserHistory from 'history/createBrowserHistory';
import { appHelpLink } from 'appConfig';

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
  mobileLanguageToggler: {
    color: theme.navMenuTextColor,
    [theme.breakpoints.lgQuery]: {
      display: 'none',
    }
  },
});

const sayMyName = gql`
  query {
    viewer {
      person {
        displayName
      }
    }
  }
`;

interface IProps {
  classes?: any;
}

const Header = ({ classes }: IProps) => {
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
                <Switch>
                  <Route
                    path="/admin"
                    render={() => (
                      <Link to="/voter" inheritColor>
                        <Trans>general.frontPage</Trans>
                      </Link>
                    )}
                  />
                  <Route
                    path="/voter"
                    render={() => (
                      <Link to="/admin" inheritColor>
                        <Trans>general.administerElections</Trans>
                      </Link>
                    )}
                  />
                </Switch>
              </MobileMenuItem>
              <MobileMenuItem>
                <Link inheritColor external noExternalIcon to={appHelpLink}>
                  <Trans>general.help</Trans>
                </Link>
              </MobileMenuItem>
              <MobileMenuItem>
                <MobileLogout />
              </MobileMenuItem>
            </MobileMenu>
            <DesktopMenu>
              <DesktopMenuItem>
                <Switch>
                  <Route
                    path="/admin"
                    render={() => (
                      <Link to="/voter" inheritColor>
                        <Trans>general.frontPage</Trans>
                      </Link>
                    )}
                  />
                  <Route
                    path="/voter"
                    render={() => (
                      <Link to="/admin" inheritColor>
                        <Trans>general.administerElections</Trans>
                      </Link>
                    )}
                  />
                </Switch>
              </DesktopMenuItem>
              <DesktopMenuItem>
                <Link inheritColor external noExternalIcon to={appHelpLink}>
                  <Trans>general.help</Trans>
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
              <UserNameAndLogout />
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

const logout = (
  context: IAuthenticatorContext,
  client: ApolloClient<any>
) => () => {
  context.signOut();
  client.resetStore();
  sessionStorage.clear();
  const history = createBrowserHistory({ forceRefresh: true });
  history.push('/logout');
};

const MobileLogout = () => {
  return (
    <ApolloConsumer>
      {client => {
        return (
          <UserContext.Consumer>
            {context => {
              if (context.user) {
                return (
                  <MobileMenuItem>
                    <a onClick={logout(context, client)}>
                      <Trans>general.logout</Trans>
                    </a>
                  </MobileMenuItem>
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

const UserNameAndLogout = () => {
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
                      <Query query={sayMyName}>
                        {({ data, loading, error }) => {
                          if (loading || error) {
                            return null;
                          } else {
                            return <>{data.viewer.person.displayName}</>;
                          }
                        }}
                      </Query>
                    </DesktopMenuItem>
                    <DesktopMenuItem>
                      <a onClick={logout(context, client)}>
                        <Trans>general.logout</Trans>
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

export default injectSheet(styles)(translate()(Header));
