import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'react-jss';
import theme from 'theme';

// Providers used in test rendering
const AllTheProviders = ({ children }: any) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

// Custom testing-library/react renderer using our providers.
const customRender = (ui: React.ReactElement, options: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
