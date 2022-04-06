import React from 'react';

import { appInst } from 'appConfig';

import HiOFLogoBar from './logoBars/HiOF';
import KHiOLogoBar from './logoBars/KHiO';
import OsloMetLogoBar from './logoBars/OsloMet';
import UiBLogoBar from './logoBars/UiB';
import UiOLogoBar from './logoBars/UiO';

const LogoBar: React.FunctionComponent = () => {
  switch (appInst) {
    case 'khio':
      return <KHiOLogoBar />;
    case 'hiof':
      return <HiOFLogoBar />;
    case 'oslomet':
      return <OsloMetLogoBar />;
    case 'uib':
      return <UiBLogoBar />;
    case 'uio':
      return <UiOLogoBar />;
    default:
      return <UiOLogoBar />;
  }
};

export default LogoBar;
