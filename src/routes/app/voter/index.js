/* @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { authEnabled } from 'appConfig'

import VoterFrontPage from './frontpage';

type Props = {
  children?: ReactChildren,
  loadVoterTexts: Function,
  userRoles: Array<string>
}

class VoterRoute extends React.Component<Props> {

  componentWillMount() {
    this.props.loadVoterTexts()
  }
  render() {
    const { userRoles } = this.props;
    if (authEnabled && (!userRoles || !userRoles.includes('voter'))) {
      return (
        <Redirect to="/login" />
      );
    }
    return (
      <div>
        <Route exact path="/voter" component={VoterFrontPage} />
      </div>
    )
  }
}

export default VoterRoute;