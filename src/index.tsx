import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloLink, split, Operation } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { createUploadLink } from 'apollo-upload-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { ApolloCache } from 'apollo-cache';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'react-jss';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { makeAuthenticator, makeUserManager, Callback } from 'react-oidc';
import { User } from 'oidc-client';

import { oidcConfig, graphqlBackend } from 'appConfig';
import Spinner from 'components/animations/Spinner';
import { ScreenSizeProvider } from 'providers/ScreenSize';
import { UserContextProvider } from 'providers/UserContext';
import App from 'routes/app';
import theme from 'theme';

import './i18n';
import { refetchVoteManagementQueries } from 'queries';

const storeToken = (props: any) => (user: User) => {
  sessionStorage.setItem(
    'evalg-token',
    user.token_type + ' ' + user.access_token
  );
  const loginFrom = sessionStorage.getItem('login_redirect');
  const redirect = loginFrom ? loginFrom : '/';
  props.history.push(redirect);
  sessionStorage.removeItem('login_redirect');
};

const userManager = makeUserManager(oidcConfig);
const callback = (props: any) => (
  // TODO: Implement onError
  <Callback userManager={userManager} onSuccess={storeToken(props)} />
);

const initializeCache = (cache: ApolloCache<any>) => {
  const initialCache = {
    admin: { __typename: 'admin', isCreatingNewElection: false },
  };

  cache.writeData({
    data: initialCache,
  });
};

// an empty schema works as long as we don't do type matching on unions in our fragments
// see https://github.com/apollographql/apollo-client/issues/3397
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [],
    },
  },
});

const constructApolloClient = () => {
  const uploadLink: ApolloLink = split(
    (operation: Operation) =>
      refetchVoteManagementQueries().includes(operation.operationName),
    new BatchHttpLink({ uri: graphqlBackend, batchInterval: 10 }),
    createUploadLink({ uri: graphqlBackend })
  );

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }: { headers: any }) => ({
      headers: {
        ...headers,
        authorization: sessionStorage.getItem('evalg-token') || null,
      },
    }));
    if (forward) {
      return forward(operation);
    } else {
      return null;
    }
  });

  const cache = new InMemoryCache({ fragmentMatcher });

  const client = new ApolloClient({
    link: ApolloLink.from([authMiddleware, uploadLink]),
    cache,
    resolvers: {},
  });

  initializeCache(cache);
  client.onResetStore(() => {
    initializeCache(cache);
    return Promise.resolve();
  });

  return client;
};

const protector = makeAuthenticator({ userManager });

const appRoot = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/callback" render={callback} />
        <ApolloProvider client={constructApolloClient()}>
          <ThemeProvider theme={theme}>
            <ScreenSizeProvider>
              <UserContextProvider userManager={userManager}>
                <React.Suspense fallback={<Spinner />}>
                  <App authManager={protector} />
                </React.Suspense>
              </UserContextProvider>
            </ScreenSizeProvider>
          </ThemeProvider>
        </ApolloProvider>
      </Switch>
    </BrowserRouter>
  );
};

ReactDOM.render(React.createElement(appRoot), document.getElementById('root'));
