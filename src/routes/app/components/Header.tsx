import * as React from 'react';
import gql from 'graphql-tag';
import injectSheet from 'react-jss';
import Link from '../../../components/link';
import LanguageToggler from './LanguageToggler';
import { useTranslation } from 'react-i18next';
import { DesktopMenu, DesktopMenuItem } from './DesktopMenu';
import { MobileMenu, MobileMenuItem } from './MobileMenu';
import { UserContext } from '../../../providers/UserContext';
import { H1 } from '../../../components/text';
import { Query } from 'react-apollo';
import { Route, Switch } from 'react-router';

import { ApolloConsumer } from 'react-apollo';
import { IAuthenticatorContext } from 'react-oidc/lib/makeAuth';
import { ApolloClient } from 'apollo-client';
import { createBrowserHistory } from 'history';
import { appHelpLink } from '../../../appConfig';
import { Classes } from 'jss';

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
  classes: Classes;
}

const Header: React.FunctionComponent<IProps> = (props: IProps) => {
  const { classes } = props;
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
                <MobileLogout />
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
                <Route
                  render={() => (
                  <Link inheritColor external noExternalIcon to={appHelpLink}>
                    {t('general.help')}
                  </Link>
                  )}
                />
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
  client: ApolloClient<any>,
) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault()
    event.stopPropagation()
    context.signOut();
    client.resetStore();
    sessionStorage.clear();
    const history = createBrowserHistory({ forceRefresh: true });
    history.push('/logout');
  };

const MobileLogout: React.FunctionComponent = () => {
  const { t } = useTranslation();
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
                      {t('general.logout')}
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

const UserNameAndLogout: React.FunctionComponent = () => {
  const { t } = useTranslation();
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
                            client.writeData({
                              data: {
                                signedInPerson: {
                                  personId: data.viewer.person.id,
                                  displayName: data.viewer.person.displayName,
                                  __typename: 'signedInPerson',
                                },
                              },
                            });
                            // TODO: Make this happen only on onload
                            return <>{data.viewer.person.displayName}</>;
                          }
                        }}
                      </Query>
                    </DesktopMenuItem>
                    <DesktopMenuItem>
                      <a style={{ color: "inherit"}} onClick={logout(context, client)} href="/" >
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
