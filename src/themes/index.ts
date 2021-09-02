import { appInst } from 'appConfig';
import KHiOTheme from './KHiO';
import HiOFTheme from './HiOF';
import OsloMetTheme from './OsloMet';

/**
 * Get the theme patch for the current institution.
 */
const getCurrentThemePatch = () => {
  switch (appInst) {
    case 'uio':
      return {}
    case 'khio':
      return KHiOTheme;
    case 'hiof':
      return HiOFTheme;
    case 'oslomet':
      return OsloMetTheme;
    default:
      return {};
  }
}

export default getCurrentThemePatch
