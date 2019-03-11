import * as React from 'react';
import injectSheet from 'react-jss';

import { Classes } from 'jss';
import { i18n } from 'i18next';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { Trans, translate } from 'react-i18next';

import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';
import Link from '../../components/link';
import Spinner from '../../components/animations/Spinner';

import Admin from './admin';
import Voter from './voter';

import { authEnabled } from '../../appConfig';
import { oidcLogoutUrl } from '../../appConfig';
import { UserContext } from '../../providers/UserContext';
import { H1 } from '../../components/text';

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

interface IFrontPageProps extends RouteComponentProps {
  classes: Classes;
  authManager: any;
  i18n: i18n;
}

const FrontPage: React.FunctionComponent<IFrontPageProps> = props => (
  <UserContext.Consumer>
    {context => {
      if (context.user) {
        props.history.push('/voter');
        return null;
      } else {
        return (
          <p style={{ fontSize: '3rem' }}>
            <H1>
              <Trans>general.welcome</Trans>
            </H1>
            <Link to="/voter">
              <Trans>general.login</Trans>
            </Link>
          </p>
        );
      }
    }}
  </UserContext.Consumer>
);

interface IStyleProp {
  classes: Classes;
}

const logout: React.FunctionComponent<IStyleProp> = props => {
  window.location.href = oidcLogoutUrl;
  return (
    <div className={props.classes.logout}>
      <div className={props.classes.spinBox}>
        <Spinner darkStyle={true} />
      </div>
      <Trans>general.logoutInProgress</Trans>
    </div>
  );
};
const styledLogout = injectSheet(styles)(logout);

interface IAppProps {
  classes: Classes;
  authManager: any;
  i18n: i18n;
}

const App: React.FunctionComponent<IAppProps> = props => {
  const { authManager, classes } = props;
  const ProtectedAdmin = authEnabled ? authManager(<Admin />) : Admin;
  const ProtectedVoter = authEnabled ? authManager(<Voter />) : Voter;

  return (
    <div className={classes.ie11ExtraFlexContainer}>
      <div className={classes.app}>
        <Header />
        <Content>
          <Route exact={true} path="/" component={withRouter(FrontPage)} />
          <Route path="/admin" component={ProtectedAdmin} />
          <Route path="/voter" component={ProtectedVoter} />
          <Route path="/logout" component={styledLogout} />
        </Content>
        <Footer />
      </div>
    </div>
  );
};

const styledApp = injectSheet(styles)(translate()(App));
export default styledApp;
