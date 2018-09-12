import * as React from 'react';
import injectSheet from 'react-jss'
import { Route } from 'react-router-dom';

// import Loading from 'components/loading';
import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';

import Admin from './admin';
import Voter from './voter';
// import Login from './login';

const dummyLogout = () => {
  console.error('Logged out.');
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1.6rem',
    minHeight: '100%',
  }
};

interface IProps {
  classes: any
}

const App: React.SFC<IProps> = ({ classes }) => (
  <div className={classes.app}>
    <Header logoutAction={dummyLogout} />
    <Content>
      {/* <Route path="/login" component={Login} /> */}
      <Route path="/admin" component={Admin} />
      <Route path="/voter" component={Voter} />
    </Content>
    <Footer />
  </div>
)

const StyledApp: any = injectSheet(styles)(App);

export default StyledApp;
