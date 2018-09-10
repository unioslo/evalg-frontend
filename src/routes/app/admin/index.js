/* @flow */
import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { authEnabled } from 'appConfig'

import AdminFrontPage from './frontpage'
import AdminElection from './election';
import NewElection from './newelection';

const Admin = () => {
  const userRoles = ['admin']
  if (authEnabled && (!userRoles.includes('admin'))) {
    return (
      <Redirect to="/login" />
    );
  }
  return (
    <div>
      <Route exact path="/admin" component={AdminFrontPage} />
      <Route exact strict path="/admin/newElection" component={NewElection} />
      <Route path="/admin/elections/:groupId" component={AdminElection} />
    </div>
  )
};

export default Admin;