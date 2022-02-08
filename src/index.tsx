import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import * as Sentry from '@sentry/browser';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  gql,
  split,
  Operation,
} from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { createUploadLink } from 'apollo-upload-client';
import { ThemeProvider } from 'react-jss';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { makeAuthenticator, makeUserManager, Callback } from 'react-oidc';
import { User } from 'oidc-client';
import { Helmet } from 'react-helmet';

import {
  oidcConfig,
  graphqlBackend,
  appVersion,
  appInst,
  sentryEnvironment,
  sentryDsn,
  sentryEnabled,
} from 'appConfig';

import { cache } from 'cache';

import Spinner from 'components/animations/Spinner';
import { ScreenSizeProvider } from 'providers/ScreenSize';
import { UserContextProvider } from 'providers/UserContext';
import App from 'routes/app';
import theme from 'theme';
import getCurrentThemePatch from 'themes';

import './i18n';
import { refetchVoteManagementQueries } from 'queries';

// Initialize sentry
if (sentryEnabled) {
  Sentry.init({
    dsn: sentryDsn,
    environment: sentryEnvironment,
    release: appVersion,
  });
}

const storeToken = (props: any) => (user: User) => {
  sessionStorage.setItem(
    'evalg-token',
    `${user.token_type} ${user.access_token}`
  );
  const loginFrom = sessionStorage.getItem('login_redirect');
  const redirect = loginFrom || '/';
  props.history.push(redirect);
  sessionStorage.removeItem('login_redirect');

  // Set the user scope in sentry for logged in users
  Sentry.configureScope((scope) => {
    scope.setUser({
      id: user.profile['dataporten-userid_sec'],
      email: user.profile.email,
    });
  });
};

const userManager = makeUserManager(oidcConfig);
const callback = (props: any) => (
  // TODO: Implement onError
  <Callback userManager={userManager} onSuccess={storeToken(props)} />
);

/**
 * Type definition for the local state queries.
 *
 * isCreatingNewElection exists only in the local apollo cache.
 */
export const typeDefs = gql`
  extend type Query {
    isCreatingNewElection: Boolean!
  }
`;

/**
 * The auth Apollo link.
 *
 * This link adds the authorization header (if set) to all graphql queries.
 */
const authMiddleware = new ApolloLink((operation, forward) => {
  const token = sessionStorage.getItem('evalg-token');
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token || '',
    },
  }));

  return forward(operation);
});

/**
 * The terminating ApolloLink.
 *
 * The queries are split into two termination links.
 *
 * - Queries in refetchVoteManagementQueries are batched together.
 * - The rest uses the UploadLink.
 *
 * UploadLink:
 * The UploadLink replaces the normal terminating HttpLink from Apollo.
 * This link add file support.
 */
const httpLink: ApolloLink = split(
  (operation: Operation) =>
    refetchVoteManagementQueries().includes(operation.operationName),
  new BatchHttpLink({ uri: graphqlBackend, batchInterval: 10 }),
  // TODO fix the UploadLink type..
  createUploadLink({ uri: graphqlBackend }) as unknown as ApolloLink
);

/**
 * The Apollo client
 */
const client = new ApolloClient({
  link: ApolloLink.from([authMiddleware, httpLink]),
  cache,
  typeDefs,
  // resolvers: {},
});

const protector = makeAuthenticator({ userManager });

const faviconPath =
  appInst !== undefined ? `favicons/${appInst}.ico` : `favicons/uio.ico`;

const appRoot = () => (
  <>
    <Helmet>
      <link rel="icon" href={faviconPath} />
      <title>eValg</title>
    </Helmet>
    <BrowserRouter>
      <Switch>
        <Route path="/callback" render={callback} />
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <ThemeProvider theme={getCurrentThemePatch()}>
              <ScreenSizeProvider>
                <UserContextProvider userManager={userManager}>
                  <React.Suspense fallback={<Spinner />}>
                    <App authManager={protector} />
                  </React.Suspense>
                </UserContextProvider>
              </ScreenSizeProvider>
            </ThemeProvider>
          </ThemeProvider>
        </ApolloProvider>
      </Switch>
    </BrowserRouter>
  </>
);

ReactDOM.render(React.createElement(appRoot), document.getElementById('root'));
