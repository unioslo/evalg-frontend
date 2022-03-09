import { appInst } from 'appConfig';
import KHiOTheme from './KHiO';
import HiOFTheme from './HiOF';
import OsloMetTheme from './OsloMet';
import UiBTheme from './UiB';

/**
 * Get the theme patch for the current institution.
 */
const getCurrentThemePatch = () => {
  switch (appInst) {
    case 'khio':
      return KHiOTheme;
    case 'hiof':
      return HiOFTheme;
    case 'oslomet':
      return OsloMetTheme;
    case 'uib':
      return UiBTheme;
    case 'uio':
      return {};
    default:
      return {};
  }
};

export default getCurrentThemePatch;
