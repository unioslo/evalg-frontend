/* @flow */
import { makeElObj, makeElObjData } from './makeElectionObjects';
import moment from 'moment-timezone';
import { appTimezone } from 'appConfig';

import {
  isObjEmpty,
  isObject,
  objPropsToSnakeCase,
  objPropsToCamelCase,
  objPropsToArray,
  allEqual,
  equalValues,
  findObjIndex,
  objsEqual,
} from './helpers';

const ISODateTimeToTimeZoneAdjustedISODate = (dateTime: string) =>
  moment.tz(dateTime, appTimezone).format('YYYY-MM-DD');

const ISODateTimeToTimeZoneAdjustedTime = (dateTime: string) =>
  moment.tz(dateTime, appTimezone).format('HH:mm');

const DateAndTimeToISODTWithTimeZonedOffset = (date: string, time: string) =>
  moment.tz(`${date}T${time}`, appTimezone).toISOString();

export {
  objPropsToArray,
  isObjEmpty,
  isObject,
  makeElObj,
  makeElObjData,
  objPropsToSnakeCase,
  objPropsToCamelCase,
  allEqual,
  equalValues,
  findObjIndex,
  objsEqual,
  ISODateTimeToTimeZoneAdjustedISODate,
  ISODateTimeToTimeZoneAdjustedTime,
  DateAndTimeToISODTWithTimeZonedOffset,
};
