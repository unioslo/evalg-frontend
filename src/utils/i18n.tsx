import camelCase from 'lodash/camelCase';
import i18n from 'i18next';

import { PersonIdType } from 'interfaces';

export const getSupportedLanguages = (): string[] => {
  return ['nb', 'en', 'nn'];
};

export const translateBackendError = ({
  errorCode,
  t,
  codePrefix = 'backend.errors',
  tOptions,
}: {
  errorCode: string | null;
  t: i18n.TFunction;
  codePrefix: string;
  tOptions?: string | i18n.TOptions<i18n.StringMap>;
}) => {
  if (errorCode === null) {
    errorCode = '';
  }
  const errorCodeKey = `${codePrefix}.${camelCase(errorCode)}`;
  const genericErrorCodeKey = `backend.errors.${camelCase(errorCode)}`;
  const unknownCategorizedKey = `${codePrefix}.unknown`;
  const unknownKey = 'backend.errors.unknown';
  return t(
    [errorCodeKey, unknownCategorizedKey, genericErrorCodeKey, unknownKey],
    tOptions
  );
};

export const joinStringsWithCommaAndAnd = (
  strings: string[],
  t: i18n.TFunction
) => {
  if (strings.length === 0) {
    return '';
  } else if (strings.length === 1) {
    return strings[0];
  }
  const commaSeparatedStrings = strings.slice(0, -1).join(', ');
  return `${commaSeparatedStrings} ${t('general.and')} ${
    strings[strings.length - 1]
  }`;
};

export const getTranslationsForPersonIdType = (t: i18n.TFunction) => ({
  uid: t('idTypes.uid'),
  nin: t('idTypes.nin'),
  feide_id: t('idTypes.feide_id'),
});

let translationsForPersonIdType: { uid: string; nin: string; feide_id: string };

export const getPersonIdTypeDisplayName = (
  personIdType: PersonIdType,
  t: i18n.TFunction
) => {
  if (!translationsForPersonIdType) {
    translationsForPersonIdType = getTranslationsForPersonIdType(t);
  }
  return translationsForPersonIdType[personIdType] || personIdType;
};
