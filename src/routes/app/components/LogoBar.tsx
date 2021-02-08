import React from 'react';

import { appInst } from 'appConfig';

import UiOLogoBar from './logoBars/UiO';

const LogoBar: React.FunctionComponent = () => {
  switch (appInst) {
    case 'uio':
      return <UiOLogoBar />;
    default:
      return <UiOLogoBar />;
  }
};

export default LogoBar;
