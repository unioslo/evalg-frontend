import { makeElObj, makeElObjData } from './makeElectionObjects';
import moment from 'moment-timezone';

import { buttonize } from './a11y';
import { appTimezone } from '../appConfig';

import {
  allEqual,
  allEqualForAttrs,
  findObjIndex,
  isObjEmpty,
  isObject,
  objPropsToSnakeCase,
  objPropsToCamelCase,
  objPropsToArray,
  objsEqual,
  reorderArray,
} from './helpers';

import { translateBackendError, joinStringsWithCommaAndAnd } from './i18n';

const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

const ISODateTimeToTimeZoneAdjustedISODate = (dateTime: string) =>
  moment.tz(dateTime, appTimezone).format('YYYY-MM-DD');

const ISODateTimeToTimeZoneAdjustedTime = (dateTime: string) =>
  moment.tz(dateTime, appTimezone).format('HH:mm');

const DateAndTimeToISODTWithTimeZonedOffset = (date: string, time: string) =>
  moment.tz(`${date}T${time}`, appTimezone).toISOString();

export {
  allEqual,
  allEqualForAttrs,
  buttonize,
  DateAndTimeToISODTWithTimeZonedOffset,
  findObjIndex,
  isObjEmpty,
  isObject,
  ISODateTimeToTimeZoneAdjustedISODate,
  ISODateTimeToTimeZoneAdjustedTime,
  joinStringsWithCommaAndAnd,
  makeElObj,
  makeElObjData,
  objsEqual,
  objPropsToArray,
  objPropsToCamelCase,
  objPropsToSnakeCase,
  translateBackendError,
  reorderArray,
  sleep,
};
