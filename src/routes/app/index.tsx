import * as React from 'react';
import injectSheet from 'react-jss';

import { Classes } from 'jss';
import { Route } from 'react-router-dom';

import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';
import Link from '../../components/link';
import Spinner from '../../components/animations/Spinner';

import AdminRoute from './admin';
import VoterRoute from './voter';

import { authEnabled } from '../../appConfig';
import { oidcLogoutUrl } from '../../appConfig';
// import { UserContext } from '../../providers/UserContext';
import { H1 } from '../../components/text';
import { UserContext } from '../../providers/UserContext';
import { useTranslation } from 'react-i18next';

import { Helmet } from 'react-helmet';

const styles = {
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
};

interface IFrontPageProps {
  // classes: Classes;
}

const FrontPage: React.FunctionComponent<IFrontPageProps> = (
  props: IFrontPageProps
) => {
  const { t } = useTranslation();

  return (
    <div style={{ fontSize: '3rem' }}>
      <H1>{t('general.welcome')}</H1>
      <Link to="/login">{t('general.login')}</Link>
    </div>
  );
};

interface IStyleProp {
  classes: Classes;
}

const logout: React.FunctionComponent<IStyleProp> = (props: IStyleProp) => {
  const { t } = useTranslation();
  window.location.href = oidcLogoutUrl;
  return (
    <div className={props.classes.logout}>
      <div className={props.classes.spinBox}>
        <Spinner darkStyle={true} />
      </div>
      {t('general.logoutInProgress')}
    </div>
  );
};
const styledLogout = injectSheet(styles)(logout);

interface IAppProps {
  classes: Classes;
  authManager: any;
}

const App: React.FunctionComponent<IAppProps> = (props: IAppProps) => {
  const { authManager, classes } = props;

  const ProtectedComponent = (props: any) => {
    if (!props.userContext) {
      sessionStorage.setItem('login_redirect', props.location.pathname);
    }
    const Component = authEnabled
      ? authManager(<props.component />)
      : props.component;

    return <Component />;
  };

  const { i18n } = useTranslation();

  return (
    <div className={classes.ie11ExtraFlexContainer}>
      <div className={classes.app}>
        <Helmet htmlAttributes={{ lang: i18n.language }} />
        <Header />
        <Content>
          <UserContext.Consumer>
            {(context: any) => {
              if (context.user || !authEnabled) {
                return (
                  <Route
                    path="/"
                    render={(props: any) => (
                      <ProtectedComponent
                        {...props}
                        component={VoterRoute}
                        userContext={context.user}
                      />
                    )}
                  />
                );
              } else {
                return <Route exact={true} path="/" component={FrontPage} />;
              }
            }}
          </UserContext.Consumer>

          <UserContext.Consumer>
            {(context: any) => {
              return (
                <Route
                  path="/admin"
                  render={(props: any) => (
                    <ProtectedComponent
                      {...props}
                      component={AdminRoute}
                      userContext={context.user}
                    />
                  )}
                />
              );
            }}
          </UserContext.Consumer>

          <Route exact={true} path="/logout" component={styledLogout} />
          <Route
            exact={true}
            path="/login"
            component={authManager(<React.Fragment />)}
          />
        </Content>
        <Footer />
      </div>
    </div>
  );
};

const styledApp = injectSheet(styles)(App);
export default styledApp;
