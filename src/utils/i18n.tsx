import { TranslationFunction } from 'i18next';

export const getSupportedLanguages = (): string[] => {
  return ['nb', 'en', 'nn'];
};

export const translateBackendError = (
  errorString: string,
  t: TranslationFunction
) => {
  if (errorString.endsWith('CANNOT_SET_KEY_UNSAFE_STATUS')) {
    return t('admin.errors.activateKeyErrorUnsafeStatus');
  }

  if (errorString.endsWith('CANNOT_SET_KEY_HAS_VOTES')) {
    return t('admin.errors.activateKeyErrorHasVotes');
  }

  return '';
};

export const joinStringsWithCommaAndAnd = (
  strings: string[],
  t: TranslationFunction
) => {
  if (strings.length === 0) {
    return '';
  } else if (strings.length === 1) {
    return strings[0];
  } else {
    const commaSeparatedStrings = strings.slice(0, -1).join(', ');
    return `${commaSeparatedStrings} ${t('general.and')} ${
      strings[strings.length - 1]
    }`;
  }
};
