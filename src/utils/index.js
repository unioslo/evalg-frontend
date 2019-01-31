/* @flow */
import { makeElObj, makeElObjData } from './makeElectionObjects';
var moment = require('moment-timezone');

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

const dateFromDT = (dateTime: string) =>
  moment
    .tz(dateTime, 'Europe/Oslo')
    .format("YYYY-MM-DD");
const timeFromDT = (dateTime: string) =>
  moment
    .tz(dateTime, 'Europe/Oslo')
    .format("HH:mm");
const DTFromDateAndTime = (date: string, time: string) =>
  moment.tz(`${date}T${time}`, 'Europe/Oslo').format();

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
  dateFromDT,
  timeFromDT,
  DTFromDateAndTime,
};
