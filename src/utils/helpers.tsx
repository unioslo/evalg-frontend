/* @flow */

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
  return str.replace(/([A-Z])/g, m => '_' + m.toLowerCase());
};

const snakeToCamel = (str: string) => {
  return str.replace(/(_\w)/g, m => m[1].toUpperCase());
};

const convertObjProps = (obj: object, func: (arg: any) => any): object => {
  const newObj = {};
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

export const objPropsToArray = (obj: object): any[] => {
  return Object.keys(obj).map(key => obj[key]);
};

export const allEqual = (array: any[]) => {
  if (array.length === 0) {
    return false;
  }
  for (let i = 1; i < array.length; i++) {
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
    if (!allEqual(array.map(item => item[attr]))) {
      return false;
    }
  }
  return true;
};

export const findObjIndex = (array: Array<{ id: string }>, id: string) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return i;
    }
  }
  return null;
};

export const objsEqual = (a: object, b: object) => {
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
