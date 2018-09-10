/* @flow */
import { makeElObj, makeElObjData } from './makeElectionObjects';

import {
  isObjEmpty,
  isObject,
  objPropsToSnakeCase,
  objPropsToCamelCase,
  objPropsToArray,
  allEqual,
  equalValues,
  findObjIndex,
  objsEqual
} from './helpers';

const dateFromDT = (dateTime: string) => dateTime.substring(0, 10);
const timeFromDT = (dateTime: string) => dateTime.substring(11, 16);
const DTFromDateAndTime = (date: string, time: string) =>
  `${date}T${time}`;

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
  DTFromDateAndTime
}
