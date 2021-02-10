import { appInst } from 'appConfig';
import KHiOTheme from './KHiO';

/**
 * Get the theme patch for the current institution.
 */
const getCurrentThemePatch = () => {
    switch (appInst) {
        case 'uio':
            return {}
        case 'khio':
            return KHiOTheme;
        default:
            return {};
    }
}

export default getCurrentThemePatch