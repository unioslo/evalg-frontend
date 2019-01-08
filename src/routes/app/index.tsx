import * as React from 'react';
import injectSheet from 'react-jss';
import { Route } from 'react-router-dom';

// import Loading from 'components/loading';
import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';

import Admin from './admin';
import Voter from './voter';

const dummyLogout = () => {
  console.error('Logged out.');
};

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
}

const App: React.SFC<IProps> = ({ classes }) => (
  <div className={classes.app}>
    <Header logoutAction={dummyLogout} />
    <Content>
      <Route path="/admin" component={Admin} />
      <Route path="/voter" component={Voter} />
    </Content>
    <Footer />
  </div>
);

const styledApp: any = injectSheet(styles)(App);
export default styledApp;
