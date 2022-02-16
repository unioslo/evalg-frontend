import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { createUseStyles } from 'react-jss';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';

import { authEnabled } from 'appConfig';
import { UserContext } from 'providers/UserContext';

import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';
import AdminRoute from './admin';
import VoterRoute from './voter';
import VoterFrontPage from './voter/frontpage';
import LoginPage from './components/LoginPage';
import Logout from './components/Logout';

const useStyles = createUseStyles({
  ie11ExtraFlexContainer: {
    // https://github.com/philipwalton/flexbugs#flexbug-3
    display: 'flex',
    flexDirection: 'column',
  },
  app: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1.6rem',
    minHeight: '100vh',
  },
  logout: {
    display: 'flex',
    justifyContent: 'center',
  },
  spinBox: {
    marginRight: '2rem',
  },
});

interface IAppProps {
  authManager: any;
}

const App: React.FunctionComponent<IAppProps & RouteComponentProps> = (
  props
) => {
  const { authManager, location, history } = props;
  const classes = useStyles();

  const ProtectedComponent = (protectedComponentProps: any) => {
    if (!protectedComponentProps.userContext) {
      sessionStorage.setItem(
        'login_redirect',
        protectedComponentProps.location.pathname
      );
    }
    const Comp = protectedComponentProps.component;
    const Component = authEnabled ? authManager(Comp) : Comp;
    return <Component />;
  };

  const { i18n } = useTranslation();

  return (
    <div className={classes.ie11ExtraFlexContainer}>
      <div className={classes.app}>
        <Helmet htmlAttributes={{ lang: i18n.language }}>
          <title>eValg</title>
        </Helmet>
        <Header history={history} />
        <UserContext.Consumer>
          {(context: any) => {
            if (!context.user && authEnabled && location.pathname === '/') {
              return (
                <Content isLoginPage>
                  <LoginPage />
                </Content>
              );
            }

            return (
              <Content>
                <Route exact path="/" component={VoterFrontPage} />

                <Route
                  path="/vote/:electionGroupId"
                  render={(renderProps: any) => (
                    <ProtectedComponent
                      {...renderProps}
                      component={VoterRoute}
                      userContext={context.user}
                    />
                  )}
                />

                <Route
                  path="/admin"
                  render={(renderProps: any) => (
                    <ProtectedComponent
                      {...renderProps}
                      component={AdminRoute}
                      userContext={context.user}
                    />
                  )}
                />

                <Route
                  exact
                  path="/logout"
                  render={() => <Logout context={context} />}
                />

                <Route
                  exact
                  path="/login"
                  component={authManager(React.Fragment)}
                />
              </Content>
            );
          }}
        </UserContext.Consumer>

        <Footer />
      </div>
    </div>
  );
};

const styledApp = withRouter(App);
export default styledApp;
