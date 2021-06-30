import { appInst } from 'appConfig';
import KHiOTheme from './KHiO';
import HiOFTheme from './HiOF';

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
        default:
            return {};
    }
}

export default getCurrentThemePatch
