import 'react-app-polyfill/ie11';
import 'core-js';

import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import * as ReactDOM from 'react-dom';
import { ThemeProvider } from 'react-jss';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { makeAuthenticator, makeUserManager, Callback } from 'react-oidc';
import { User } from 'oidc-client';

import { ScreenSizeProvider } from './providers/ScreenSize';
import { UserContextProvider } from './providers/UserContext';
import App from './routes/app';
import theme from './theme';

import { oidcConfig, graphqlBackend } from './appConfig';
import { withClientState } from 'apollo-link-state';
import { persistCache } from 'apollo-cache-persist';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';
import Spinner from './components/animations/Spinner';

import './i18n';

const storeToken = (props: any) => (user: User) => {
  sessionStorage.setItem(
    'evalg-token',
    user.token_type + ' ' + user.access_token
  );
  const loginFrom = sessionStorage.getItem('login_redirect');
  const redirect = loginFrom ? loginFrom : '/';
  props.history.push(redirect);
  // sessionStorage.removeItem('login_redirect');
};

const userManager = makeUserManager(oidcConfig);
const callback = (props: any) => (
  // TODO: Implement onError
  <Callback userManager={userManager} onSuccess={storeToken(props)} />
);

const constructApolloClient = () => {
  // uploadLink extends HttpLink from 'apollo-link-http'
  const uploadLink: ApolloLink = createUploadLink({ uri: graphqlBackend });

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
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

  const cache = new InMemoryCache();

  // TODO: remove the "as type" when it's been fixed upstream
  // https://github.com/apollographql/apollo-cache-persist/pull/58
  persistCache({
    cache: cache,
    storage: window.sessionStorage as PersistentStorage<
      PersistedData<NormalizedCacheObject>
    >,
  });

  const defaults = {
    voter: {
      __typename: 'voter',
      selectedPollBookID: '',
      notInPollBookJustification: '',
    },
    signedInPerson: {
      __typename: 'signedInPerson',
      personId: '',
      displayName: '',
    },
    admin: { __typename: 'admin', isCreatingNewElection: false },
  };

  const stateLink = withClientState({
    cache,
    resolvers: null,
    defaults,
  });

  const client = new ApolloClient({
    link: ApolloLink.from([stateLink, authMiddleware, uploadLink]),
    cache,
  });

  // client.onResetStore(stateLink.writeDefaults); // TODO: update apollo stuff to make this work

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
