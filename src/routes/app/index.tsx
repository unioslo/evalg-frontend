import * as React from 'react';
import injectSheet from 'react-jss';
import { Route } from 'react-router-dom';
import { UserData } from 'react-oidc';
import { ApolloConsumer } from 'react-apollo';
import { IAuthenticatorContext } from 'react-oidc/lib/makeAuth';
import { ApolloClient } from 'apollo-client';
import createBrowserHistory from 'history/createBrowserHistory';

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
};

interface IProps {
  classes: any;
  authManager: any;
}

const FrontPage: React.SFC = () => (
  <p style={{fontSize: '3rem'}}>
    <Link to="/admin">Admin</Link> | <Link to="/voter">Voter</Link>
  </p>
);

const Logout: React.SFC = () => {
  window.location.href = oidcLogoutUrl;
  return <div />;
};

const WrapHeaderForLogout: React.SFC = () => {
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
  return (
    <ApolloConsumer>
      {client => (
        <UserData.Consumer>
          {context => <Header logoutAction={logout(context, client)} />}
        </UserData.Consumer>
      )}
    </ApolloConsumer>
  );
};

const App: React.SFC<IProps> = ({ classes, authManager }) => {
  const ProtectedAdmin = authEnabled ? authManager(<Admin />) : Admin;
  const ProtectedVoter = authEnabled ? authManager(<Voter />) : Voter;

  return (
    <div className={classes.app}>
      <WrapHeaderForLogout />
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

const styledApp: any = injectSheet(styles)(App);
export default styledApp;
