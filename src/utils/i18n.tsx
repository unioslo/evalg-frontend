import camelCase from 'lodash/camelCase';
import i18n from 'i18next';

export const getSupportedLanguages = (): string[] => {
  return ['nb', 'en', 'nn'];
};

export const translateBackendError = (
  errorCode: string,
  t: i18n.TFunction,
  codePrefix = 'backend.errors',
  ...rest: any
) => {
  const errorCodeKey = `${codePrefix}.${camelCase(errorCode)}`;
  const unknownCategorizedKey = `$(codePrefix).unknown`;
  const unknownKey = 'backend.errors.unknown';
  return t([errorCodeKey, unknownCategorizedKey, unknownKey], ...rest);
};

export const joinStringsWithCommaAndAnd = (
  strings: string[],
  t: i18n.TFunction
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

export const getTranslationsForVoterIdType = (t: i18n.TFunction) => ({
  uid: t('census.idTypes.uid'),
  nin: t('census.idTypes.nin'),
  feide_id: t('census.idTypes.feide_id'),
});

let translationsForVoterIdType: { uid: string; nin: string; feide_id: string };

export const getVoterIdTypeDisplayName = (
  voterIdType: string,
  t: i18n.TFunction
) => {
  if (!translationsForVoterIdType) {
    translationsForVoterIdType = getTranslationsForVoterIdType(t);
  }
  return translationsForVoterIdType[voterIdType] || voterIdType;
};
