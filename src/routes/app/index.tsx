import * as React from 'react';
import injectSheet from 'react-jss';

import { Route } from 'react-router-dom';
import { Trans, translate } from 'react-i18next';

import Spinner from '../../components/animations/Spinner';

import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';
import Link from '../../components/link';

import Admin from './admin';
import Voter from './voter';

import { authEnabled } from '../../appConfig';
import { oidcLogoutUrl } from '../../appConfig';
import { Classes } from 'jss';
import { i18n } from 'i18next';

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

interface IProps {
  classes: Classes;
  authManager: any;
  i18n: i18n;
}

const FrontPage: React.SFC = () => (
  <p style={{ fontSize: '3rem' }}>
    <Link to="/admin">Admin</Link> | <Link to="/voter">Voter</Link>
  </p>
);

interface IStyleProp {
  classes: Classes;
}

const logout: React.SFC<IStyleProp> = (props: IStyleProp) => {
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
const styledLogout = injectSheet(styles as any)(logout)

const App: React.SFC<IProps> = (props: IProps) => {
  const { authManager, classes } = props;
  const ProtectedAdmin = authEnabled ? authManager(<Admin />) : Admin;
  const ProtectedVoter = authEnabled ? authManager(<Voter />) : Voter;

  return (
    <div className={classes.ie11ExtraFlexContainer}>
      <div className={classes.app}>
        <Header />
        <Content>
          <Route exact={true} path="/" component={FrontPage} />
          <Route path="/admin" component={ProtectedAdmin} />
          <Route path="/voter" component={ProtectedVoter} />
          <Route path="/logout" component={styledLogout} />
        </Content>
        <Footer />
      </div>
    </div>
  );
};

const styledApp = injectSheet(styles as any)(translate()(App));
export default styledApp;
