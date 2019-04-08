import validUrl from 'valid-url';

export const validateEmail = (email: string) =>
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

export const validateUrl = (url: any) => !!validUrl.isWebUri(url);
