import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch } from 'react-router';
import { History } from 'history';
import { Classes } from 'jss';
import { createUseStyles, useTheme } from 'react-jss';
import { ApolloClient, ApolloConsumer } from '@apollo/client';

import { getSignedInPersonDisplayName } from 'queries';
import { appHelpLink, appHelpMail, appInst } from 'appConfig';
import Link from 'components/link';
import { H1 } from 'components/text';
import { UserContext } from 'providers/UserContext';
import LanguageSelector, { MobileLanguageSelector } from './LanguageSelector';
import { DesktopMenu, DesktopMenuItem } from './DesktopMenu';
import { MobileMenu, MobileMenuItem } from './MobileMenu';
import LogoBar from './logoBar';

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
        {(context) => {
          if (context.user) {
            return (
              <a
                style={{ color: 'inherit' }}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToLogout(history);
                }}
                href="/"
              >
                {t('general.logout')}
              </a>
            );
          }
          return null;
        }}
      </UserContext.Consumer>
    </>
  );
};

const UserNameAndLogout: React.FunctionComponent<{
  apolloClient: ApolloClient<any>;
  classes: Classes;
  history: History;
}> = ({ apolloClient, classes, history }) => {
  const { t } = useTranslation();
  const [userDisplayName, setUserDisplayName] = useState('');
  const userContext = useContext(UserContext);

  useEffect(() => {
    const getDisplayName = async () => {
      let displayName;
      if (userContext.user) {
        try {
          displayName = await getSignedInPersonDisplayName(apolloClient);
          setUserDisplayName(displayName);
        } catch (error) {
          console.error('Could not get ID of signed in user.');
        }
      }
    };
    getDisplayName();
  }, [userContext, apolloClient]);

  return (
    <ApolloConsumer>
      {() => {
        return (
          <UserContext.Consumer>
            {(context) => {
              if (context.user) {
                return (
                  <>
                    <DesktopMenuItem>
                      <div className={classes.link}>{userDisplayName}</div>
                    </DesktopMenuItem>
                    <DesktopMenuItem>
                      <a
                        className={classes.link}
                        onClick={(e) => {
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
              }
              return null;
            }}
          </UserContext.Consumer>
        );
      }}
    </ApolloConsumer>
  );
};

const useStyles = createUseStyles((theme: any) => ({
  mainWrapper: {
    backgroundColor: theme.headerMainAreaColor,
  },
  main: {
    margin: '0 auto',
    maxWidth: theme.appMaxWidth,
    height: '12rem',
    padding: `2.5rem ${theme.horizontalPadding} 3rem ${theme.horizontalPadding}`,
    [theme.breakpoints.mdQuery]: {
      padding: `2.5rem ${theme.horizontalMdPadding} 3rem ${theme.horizontalMdPadding}`,
    },
  },
  mainRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    color: theme.headerTitleColor,
  },
  desc: {
    fontSize: '1.7rem',
    lineHeight: '1.5',
    color: theme.headerDescColor,
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
  link: {
    color: theme.linkColor,
  },
  divider: {
    borderTop: `1px solid ${theme.headerTitleColor}`,
  },
}));

interface IProps {
  history: History;
}

const Header: React.FunctionComponent<IProps> = (props: IProps) => {
  const { history } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });
  const userContext = useContext(UserContext);

  return (
    <header>
      <LogoBar />
      <div className={classes.mainWrapper}>
        <div className={classes.main}>
          <div className={classes.mainRow}>
            <div className={classes.title}>
              <Switch>
                <Route
                  path="/admin"
                  render={() => (
                    <div className={classes.link}>
                      <Link to="/admin" inheritColor noUnderline>
                        <H1>eValg</H1>
                      </Link>
                    </div>
                  )}
                />
                <Route
                  path="/"
                  render={() => (
                    <div className={classes.link}>
                      <Link to="/" inheritColor noUnderline>
                        <H1>eValg</H1>
                      </Link>
                    </div>
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
                      <div className={classes.link}>
                        <Link to="/" inheritColor>
                          {t('general.frontPage')}
                        </Link>
                      </div>
                    )}
                  />
                  <Route
                    path="/"
                    render={() => (
                      <div className={classes.link}>
                        <Link to="/admin" inheritColor>
                          {t('general.administerElections')}
                        </Link>
                      </div>
                    )}
                  />
                </Switch>
              </MobileMenuItem>
              <MobileMenuItem>
                <div className={classes.link}>
                  {appHelpMail ? (
                    <Link mail noExternalIcon to={appHelpMail} inheritColor>
                      {t('general.help')}
                    </Link>
                  ) : (
                    <Link external noExternalIcon to={appHelpLink} inheritColor>
                      {t('general.help')}
                    </Link>
                  )}
                </div>
              </MobileMenuItem>
              <MobileMenuItem>
                <div className={classes.link}>
                  <MobileLogout history={history} />
                </div>
              </MobileMenuItem>
            </MobileMenu>
            <DesktopMenu>
              <DesktopMenuItem>
                <Switch>
                  <Route
                    path="/admin"
                    render={() => (
                      <div className={classes.link}>
                        <Link to="/" inheritColor>
                          {t('general.frontPage')}
                        </Link>
                      </div>
                    )}
                  />
                  <Route
                    path="/"
                    render={() => (
                      <div className={classes.link}>
                        <Link to="/admin" inheritColor>
                          {t('general.administerElections')}
                        </Link>
                      </div>
                    )}
                  />
                </Switch>
              </DesktopMenuItem>
              <DesktopMenuItem>
                <div className={classes.link}>
                  {appHelpMail ? (
                    <Link mail noExternalIcon to={appHelpMail} inheritColor>
                      {t('general.help')}
                    </Link>
                  ) : (
                    <Link external noExternalIcon to={appHelpLink} inheritColor>
                      {t('general.help')}
                    </Link>
                  )}
                </div>
              </DesktopMenuItem>
              <DesktopMenuItem>
                <div className={classes.link}>
                  <LanguageSelector />
                </div>
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
            {userContext.user && (
              <DesktopMenu>
                <ApolloConsumer>
                  {(client) => (
                    <UserNameAndLogout
                      history={history}
                      classes={classes}
                      apolloClient={client}
                    />
                  )}
                </ApolloConsumer>
              </DesktopMenu>
            )}
            <MobileLanguageSelector />
          </div>
        </div>
      </div>
      {appInst === 'khio' && <hr className={classes.divider} />}
    </header>
  );
};

export default Header;
