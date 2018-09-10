/* @flow */
import * as React from 'react';
import { Route } from 'react-router-dom';
import injectSheet from 'react-jss'

import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import Loading from 'components/loading';

import Admin from './admin';
//import Voter from './voter';
import Login from './login';

const dummyLogout = () => {
  console.error('Logged out.');
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    fontSize: '1.6rem'
  }
};

const App = ({ classes }) => (
  <div className={classes.app}>
    <Header logoutAction={dummyLogout} />
    <Content>
      {/* <Route path="/login" component={Login} /> */}
      <Route path="/admin" component={Admin} />
      {/* <Route path="/voter" component={Voter} /> */}
    </Content>
    <Footer />
  </div>
)

export default injectSheet(styles)(App);
