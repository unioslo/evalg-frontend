import { makeElObj, makeElObjData } from './makeElectionObjects';
import moment from 'moment-timezone';
import { appTimezone } from '../appConfig';

import { buttonize } from './a11y';

import {
  isObjEmpty,
  isObject,
  objPropsToSnakeCase,
  objPropsToCamelCase,
  objPropsToArray,
  allEqual,
  allEqualForAttrs,
  findObjIndex,
  objsEqual,
} from './helpers';

import { translateBackendError, joinStringsWithCommaAndAnd } from './i18n';

const sleep = async (ms: number) => {
  await new Promise(resolve => setTimeout(resolve, ms));
};

const ISODateTimeToTimeZoneAdjustedISODate = (dateTime: string) =>
  moment.tz(dateTime, appTimezone).format('YYYY-MM-DD');

const ISODateTimeToTimeZoneAdjustedTime = (dateTime: string) =>
  moment.tz(dateTime, appTimezone).format('HH:mm');

const DateAndTimeToISODTWithTimeZonedOffset = (date: string, time: string) =>
  moment.tz(`${date}T${time}`, appTimezone).toISOString();

export {
  buttonize,
  sleep,
  translateBackendError,
  joinStringsWithCommaAndAnd,
  objPropsToArray,
  isObjEmpty,
  isObject,
  makeElObj,
  makeElObjData,
  objPropsToSnakeCase,
  objPropsToCamelCase,
  allEqual,
  allEqualForAttrs,
  findObjIndex,
  objsEqual,
  ISODateTimeToTimeZoneAdjustedISODate,
  ISODateTimeToTimeZoneAdjustedTime,
  DateAndTimeToISODTWithTimeZonedOffset,
};
