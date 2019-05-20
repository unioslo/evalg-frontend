import React from 'react';
import injectSheet from 'react-jss';

import { Classes } from 'jss';
import { Route } from 'react-router-dom';

import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';
import Spinner from '../../components/animations/Spinner';
import Link from '../../components/link';
import { H1 } from '../../components/text';

import AdminRoute from './admin';
import VoterRoute from './voter';

import { authEnabled } from '../../appConfig';
import { oidcLogoutUrl } from '../../appConfig';
// import { UserContext } from '../../providers/UserContext';
import { UserContext } from '../../providers/UserContext';
import { useTranslation } from 'react-i18next';

import { Helmet } from 'react-helmet';

import VoterFrontPage from './voter/frontpage';

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

const FrontPage: React.FunctionComponent<{}> = () => {
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

const Logout: React.FunctionComponent<IStyleProp> = (props: IStyleProp) => {
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
const styledLogout = injectSheet(styles)(Logout);

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
    const Comp = props.component;
    const Component = authEnabled ? authManager(<Comp />) : Comp;
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
              return (
                <>
                  {context.user || !authEnabled ? (
                    <Route exact={true} path="/" component={VoterFrontPage} />
                  ) : (
                    <Route exact={true} path="/" component={FrontPage} />
                  )}

                  <Route
                    path="/vote/:electionGroupId"
                    render={(props: any) => (
                      <ProtectedComponent
                        {...props}
                        component={VoterRoute}
                        userContext={context.user}
                      />
                    )}
                  />
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
                </>
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
