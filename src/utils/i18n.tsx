import camelCase from 'lodash/camelCase';
import { TFunction, TOptions, StringMap } from 'i18next';

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
  t: TFunction;
  codePrefix: string;
  tOptions?: string | TOptions<StringMap>;
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

export const joinStringsWithCommaAndAnd = (strings: string[], t: TFunction) => {
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

export const getTranslationsForPersonIdType = (t: TFunction) => ({
  uid: t('idTypes.uid'),
  nin: t('idTypes.nin'),
  feide_id: t('idTypes.feide_id'),
});

let translationsForPersonIdType: { uid: string; nin: string; feide_id: string };

export const getPersonIdTypeDisplayName = (
  personIdType: PersonIdType,
  t: TFunction
) => {
  if (!translationsForPersonIdType) {
    translationsForPersonIdType = getTranslationsForPersonIdType(t);
  }
  return translationsForPersonIdType[personIdType] || personIdType;
};
