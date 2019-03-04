import { TranslationFunction } from 'i18next';
import camelCase from 'lodash/camelCase';

export const getSupportedLanguages = (): string[] => {
  return ['nb', 'en', 'nn'];
};

export const translateBackendError = (
  errorCode: string,
  t: TranslationFunction
) => {
  const errorCodeKey = `admin.backendErrors.${camelCase(errorCode)}`;
  const unknownKey = 'admin.backendErrors.unknown';
  return t([errorCodeKey, unknownKey]);
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
