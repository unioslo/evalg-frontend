import { TranslationFunction } from "i18next";

export const lookupErrorMessageForBackendError = (errorString: string, t: TranslationFunction) => {

  if (errorString.endsWith("CANNOT_SET_KEY_UNSAFE_STATUS")) {
    return t('admin.errors.activateKeyErrorUnsafeStatus');
  }

  if (errorString.endsWith("CANNOT_SET_KEY_HAS_VOTES")) {
    return t('admin.errors.activateKeyErrorHasVotes');
  }
  
  return '';
}