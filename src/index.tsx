import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-boost';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from 'react-jss';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { makeAuthenticator, makeUserManager, Callback } from 'react-oidc';
import { User } from 'oidc-client';

import { ScreenSizeProvider } from 'providers/ScreenSize';
import i18n from './i18n';
import App from './routes/app';
import theme from './theme';

import { oidcConfig, graphqlBackend } from 'appConfig';

const storeToken = (props: any) => (user: User) => {
  sessionStorage.setItem(
    'evalg-token',
    user.token_type + ' ' + user.access_token
  );
  props.history.push('/');
};

const userManager = makeUserManager(oidcConfig);
const callback = (props: any) => (
  // TODO: Implement onError
  <Callback userManager={userManager} onSuccess={storeToken(props)} />
);

const constructApolloClient = () => {
  const httpLink = new HttpLink({ uri: graphqlBackend });

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

  return new ApolloClient({
    link: authMiddleware.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

const protector = makeAuthenticator({ userManager });

const appRoot = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/callback" render={callback} />
        <ApolloProvider client={constructApolloClient()}>
          <ThemeProvider theme={theme}>
            <I18nextProvider i18n={i18n} initialLanguage="nb">
              <ScreenSizeProvider>
                <App authManager={protector} />
              </ScreenSizeProvider>
            </I18nextProvider>
          </ThemeProvider>
        </ApolloProvider>
      </Switch>
    </BrowserRouter>
  );
};

ReactDOM.render(React.createElement(appRoot), document.getElementById('root'));
