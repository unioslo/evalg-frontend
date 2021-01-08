import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'react-jss';
import { I18nextProvider} from 'react-i18next';
import i18n from 'i18n-test';

import { ScreenSizeProvider } from 'providers/ScreenSize';
import theme from 'theme';

jest.mock('providers/ScreenSize');



// Providers used in test rendering
const AllTheProviders = ({ children }: any) => {
  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <ScreenSizeProvider>{children}</ScreenSizeProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
};

// Custom testing-library/react renderer using our providers.
const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
