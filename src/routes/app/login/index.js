/* @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


class LoginPage extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.props.getUserTokenDev}>Get User Token</button>
        <button onClick={this.props.getAdminTokenDev}>Get Admin Token</button>
        <Link to="/voter">To voter page</Link>
        <Link to="/admin">To admin page</Link>
      </div>
    )
  }
}

export default LoginPage;