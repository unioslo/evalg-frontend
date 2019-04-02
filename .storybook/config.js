import { configure, addDecorator } from '@storybook/react';

import React from 'react';
import { ThemeProvider } from 'react-jss';
import theme from '../src/theme';
import { BrowserRouter } from 'react-router-dom';

import '../src/i18n';
import Spinner from '../src/components/animations/Spinner';

const pc = fn => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <React.Suspense fallback={<Spinner />}>{fn()}</React.Suspense>
    </ThemeProvider>
  </BrowserRouter>
);
addDecorator(pc);

const req = require.context('../src/stories', true, /\.stories\.*$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
