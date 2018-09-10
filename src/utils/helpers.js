/* @flow */

export const isObjEmpty = (obj: Object): boolean => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

export const isObject = (val: any) => {
  return Object.prototype.toString.call(val).includes('Object')
};

const isArrayOfObjects = (val: any) => {
  if (Object.prototype.toString.call(val).includes('Array')) {
    let result = true;
    val.forEach(value => {
      if (!Object.prototype.toString.call(value).includes('Object')) {
        result = false;
      }
    });
    return result;
  }
};


const camelToSnake = (str) => {
  return str.replace(/([A-Z])/g, function ($1) { return "_" + $1.toLowerCase(); });
};

const snakeToCamel = (str) => {
  return str.replace(/(_\w)/g, function (m) { return m[1].toUpperCase(); });
};

const convertObjProps = (obj: Object, func: Function): Object => {
  const newObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (isObject(obj[key])) {
        newObj[func(key)] = convertObjProps(obj[key], func);
      }
      else if (isArrayOfObjects(obj[key])) {
        newObj[func(key)] = obj[key].map(arrayObj =>
          convertObjProps(arrayObj, func));
      }
      else if (obj[key] === '') {
        newObj[func(key)] = null;
      }
      else {
        newObj[func(key)] = obj[key];
      }
    }
  }
  return newObj;
};

export const objPropsToSnakeCase = (obj: Object): Object => {
  return convertObjProps(obj, camelToSnake);
};


export const objPropsToCamelCase = (obj: Object): Object => {
  return convertObjProps(obj, snakeToCamel)
};

export const objPropsToArray = (obj: Object): Array<any> => {
  return Object.keys(obj).map(key => obj[key]);
};

export const allEqual = (array: Array<any>) => {
  for (let i = 1; i < array.length; i++) {
    if (array[i] !== array[0]) {
      return false;
    }
  }
  return array[0];
};

export const equalValues = (array: Array<any>, attrs: Array<string>) => {
  if (array.length === 0) {
    return false;
  }
  if (array.length === 1) {
    return true;
  }
  for (let i = 0; i < attrs.length; i++) {
    if (!allEqual(array.map(item => item[attrs[i]]))) {
      return false;
    }
  }
  return true;
};

export const findObjIndex = (array: Array<Object>, id: string) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return i;
    }
  }
  return null;
};

export const objsEqual = (a: Object, b: Object) => {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) {
    return false;
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
};