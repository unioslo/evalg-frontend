import * as React from 'react';
import injectSheet from 'react-jss';
import { Route, Link } from 'react-router-dom';
import { UserData } from 'react-oidc';
import { ApolloConsumer } from 'react-apollo';
import { IAuthenticatorContext } from 'react-oidc/lib/makeAuth';
import { ApolloClient } from 'apollo-boost';
import createBrowserHistory from 'history/createBrowserHistory';

import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';

import Admin from './admin';
import Voter from './voter';

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

const RoutesRequiringAuth: React.SFC = () => (
  <>
    <Route path="/admin" component={Admin} />
    <Route path="/voter" component={Voter} />
  </>
);

const FrontPage: React.SFC = () => (
  <>
    <Link to="/admin">Administer</Link>
    <br />
    <Link to="/voter">Vote</Link>
  </>
);

const PublicRoutes: React.SFC = () => (
  <>
    <Route exact={true} path="/" component={FrontPage} />
  </>
);

const WrapHeaderForLogout: React.SFC = () => {
  const logout = (
    context: IAuthenticatorContext,
    client: ApolloClient<any>
  ) => () => {
    context.signOut();
    client.resetStore();
    sessionStorage.clear();
    const history = createBrowserHistory({ forceRefresh: true });
    history.push('/');
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
  const ProtectedRoutes = authManager(<RoutesRequiringAuth />);
  return (
    <div className={classes.app}>
      <WrapHeaderForLogout />
      <Content>
        <ProtectedRoutes />
        <PublicRoutes />
      </Content>
      <Footer />
    </div>
  );
};

const styledApp: any = injectSheet(styles)(App);
export default styledApp;
