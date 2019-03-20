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

function FrontPage(props: IFrontPageProps) {
  const { t } = useTranslation();

  return (
    <div style={{ fontSize: '3rem' }}>
      <H1>{t('general.welcome')}</H1>
      <Link to="/login">{t('general.login')}</Link>
    </div>
  );
}

interface IStyleProp {
  classes: Classes;
}

function logout(props: IStyleProp) {
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
}
const styledLogout = injectSheet(styles)(logout);

interface IAppProps {
  classes: Classes;
  authManager: any;
}

function App(props: IAppProps) {
  const { authManager, classes } = props;
  const ProtectedAdmin = authEnabled ? authManager(<AdminRoute />) : AdminRoute;
  const ProtectedVoter = authEnabled ? authManager(<VoterRoute />) : VoterRoute;

  return (
    <div className={classes.ie11ExtraFlexContainer}>
      <div className={classes.app}>
        <Header />
        <Content>
          <UserContext.Consumer>
            {(context: any) => {
              if (context.user || !authEnabled) {
                return <Route path="/" component={ProtectedVoter} />;
              } else {
                return <Route exact={true} path="/" component={FrontPage} />;
              }
            }}
          </UserContext.Consumer>
          <Route path="/admin" component={ProtectedAdmin} />
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
}

const styledApp = injectSheet(styles)(App);
export default styledApp;
