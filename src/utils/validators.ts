import validUrl from 'valid-url';

const emailRE = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const feideIdRE = /^[a-zæøåA-ZÆØÅ_][a-zæøåA-ZÆØÅ0-9_.-]*@[a-zæøåA-ZÆØÅ0-9_.]+$/;
const ninRE = /^\d{11}$/;

export const validateEmail = (email: string) => emailRE.test(email);

export const validateUrl = (url: any) => !!validUrl.isWebUri(url);

export const validateFeideId = (value: string) => feideIdRE.test(value);

export const validateNin = (value: string) => ninRE.test(value);
