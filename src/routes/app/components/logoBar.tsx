import React from 'react';

import { appInst } from 'appConfig';

import HiOFLogoBar from './logoBars/HiOF';
import KHiOLogoBar from './logoBars/KHiO';
import UiOLogoBar from './logoBars/UiO';

const LogoBar: React.FunctionComponent = () => {
  switch (appInst) {
    case 'uio':
      return <UiOLogoBar />;
    case 'khio':
      return <KHiOLogoBar />;
    case 'hiof':
      return <HiOFLogoBar />;
    default:
      return <UiOLogoBar />;
  }
};

export default LogoBar;
