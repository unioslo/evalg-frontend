import { appCandOrder } from 'appConfig';
import { Candidate } from 'interfaces';

export const isObjEmpty = (obj: any): boolean => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

export const isObject = (val: any) => {
  return Object.prototype.toString.call(val).includes('Object');
};

const isArrayOfObjects = (val: any[]) => {
  if (Object.prototype.toString.call(val).includes('Array')) {
    let result = true;
    val.forEach((value: any) => {
      if (!Object.prototype.toString.call(value).includes('Object')) {
        result = false;
      }
    });
    return result;
  }
  return false;
};

const camelToSnake = (str: string) => {
  return str.replace(/([A-Z])/g, (m) => '_' + m.toLowerCase());
};

const snakeToCamel = (str: string) => {
  return str.replace(/(_\w)/g, (m) => m[1].toUpperCase());
};

const convertObjProps = (obj: any, func: (arg: any) => any): object => {
  const newObj: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (isObject(obj[key])) {
        newObj[func(key)] = convertObjProps(obj[key], func);
      } else if (isArrayOfObjects(obj[key])) {
        newObj[func(key)] = obj[key].map((arrayObj: object) =>
          convertObjProps(arrayObj, func)
        );
      } else if (obj[key] === '') {
        newObj[func(key)] = null;
      } else {
        newObj[func(key)] = obj[key];
      }
    }
  }
  return newObj;
};

export const objPropsToSnakeCase = (obj: object): object => {
  return convertObjProps(obj, camelToSnake);
};

export const objPropsToCamelCase = (obj: object): object => {
  return convertObjProps(obj, snakeToCamel);
};

export const objPropsToArray = (obj: any): any[] => {
  return Object.keys(obj).map((key) => obj[key]);
};

export const allEqual = (array: any[]) => {
  if (array.length === 0) {
    return false;
  }
  for (let i = 1; i < array.length; i += 1) {
    if (array[i] !== array[0]) {
      return false;
    }
  }
  return array[0];
};

export const allEqualForAttrs = (array: any[], attrs: string[]) => {
  if (array.length === 0) {
    return false;
  }
  if (array.length === 1) {
    return true;
  }
  for (const attr of attrs) {
    if (!allEqual(array.map((item) => item[attr]))) {
      return false;
    }
  }
  return true;
};

export const findObjIndex = (array: Array<{ id: string }>, id: string) => {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].id === id) {
      return i;
    }
  }
  return null;
};

export const objsEqual = (a: any, b: any) => {
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) {
    return false;
  }
  for (const aProp of aProps) {
    if (a[aProp] !== b[aProp]) {
      return false;
    }
  }
  return true;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const emptyArray: T[] = [];
  const shuffledArray = emptyArray.concat(array);
  for (let i = shuffledArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffledArray[i];
    shuffledArray[i] = shuffledArray[j];
    shuffledArray[j] = temp;
  }
  return shuffledArray;
};

export const getCandidateArray = (candidates: Candidate[]) => {
  switch (appCandOrder) {
    case 'sorted':
      return candidates.sort((a, b) => a.name.localeCompare(b.name));
    case 'random':
      return shuffleArray(candidates);
    default:
      return shuffleArray(candidates);
  }
};

/**
 * Swaps the positions of two elements in a list
 *
 * @param list {T[]} List to reorder
 * @param startIndex {number} Index of element to move.
 * @param endIndex {number} Index to move the element to.
 * @returns New reordered copy of the list.
 */
export const reorderArray = <T>(
  list: T[],
  startIndex: number,
  endIndex: number
) => {
  const result: T[] = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
