import ApolloClient from 'apollo-boost';
import * as React from 'react';
import { ApolloProvider } from "react-apollo";
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from "react-i18next";
import { ThemeProvider } from 'react-jss';
import { BrowserRouter } from 'react-router-dom';


import i18n from './i18n';
import App from './routes/app';
import theme from './theme';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
});

const appRoot = () => {
  return (
    <ApolloProvider client={client} >
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n} initialLanguage='nb'>
            <App />
          </I18nextProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  )
};

ReactDOM.render(
  React.createElement(appRoot),
  document.getElementById('root')
);
