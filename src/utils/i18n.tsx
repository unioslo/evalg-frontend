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

export const getTranslationsForVoterIdType = (t: TranslationFunction) => ({
  uid: t('census.idTypes.uid'),
  nin: t('census.idTypes.nin'),
  feide_id: t('census.idTypes.feide_id'),
});

let translationsForVoterIdType: { uid: string, nin: string, feide_id: string };

export const getVoterIdTypeDisplayName = (
  voterId: string,
  t: TranslationFunction
) => {
  if (!translationsForVoterIdType) {
    translationsForVoterIdType = getTranslationsForVoterIdType(t);
  }
  return translationsForVoterIdType[voterId] || voterId;
};
