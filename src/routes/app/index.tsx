import * as React from 'react';
import injectSheet from 'react-jss';

import { Route } from 'react-router-dom';
import { Trans, translate } from 'react-i18next';

import Spinner from 'components/animations/Spinner';

import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';
import Link from 'components/link';

import Admin from './admin';
import Voter from './voter';

import { authEnabled } from 'appConfig';
import { oidcLogoutUrl } from 'appConfig';

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1.6rem',
    minHeight: '100%',
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
  classes: any;
  authManager: any;
  i18n: object;
}

const FrontPage: React.SFC = () => (
  <p style={{ fontSize: '3rem' }}>
    <Link to="/admin">Admin</Link> | <Link to="/voter">Voter</Link>
  </p>
);

interface IStyleProp {
  classes: any;
}

const Logout: React.SFC = injectSheet(styles)(({ classes }: IStyleProp) => {
  window.location.href = oidcLogoutUrl;
  return (
    <div className={classes.logout}>
      <div className={classes.spinBox}>
        <Spinner darkStyle={true} />
      </div>
      <Trans>general.logoutInProgress</Trans>
    </div>
  );
});

const App: React.SFC<IProps> = ({ classes, authManager }) => {
  const ProtectedAdmin = authEnabled ? authManager(<Admin />) : Admin;
  const ProtectedVoter = authEnabled ? authManager(<Voter />) : Voter;

  return (
    <div className={classes.app}>
      <Header />
      <Content>
        <Route exact={true} path="/" component={FrontPage} />
        <Route path="/admin" component={ProtectedAdmin} />
        <Route path="/voter" component={ProtectedVoter} />
        <Route path="/logout" component={Logout} />
      </Content>
      <Footer />
    </div>
  );
};

const styledApp: any = injectSheet(styles)(translate()(App));
export default styledApp;
