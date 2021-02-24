import React from 'react';

import { appInst } from 'appConfig';

import KHiOLogoBar from './logoBars/KHiO';
import UiOLogoBar from './logoBars/UiO';

const LogoBar: React.FunctionComponent = () => {
  switch (appInst) {
    case 'uio':
      return <UiOLogoBar />;
    case 'khio':
      return <KHiOLogoBar />;
    default:
      return <UiOLogoBar />;
  }
};

export default LogoBar;
