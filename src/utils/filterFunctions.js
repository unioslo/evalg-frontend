/* @flow */

export const filterObjPropValue = (
  inputArray: Array<Object>,
  attribute: string,
  filterValue: string,
) => {
  if (filterValue === '') {
    return inputArray;
  }
  return inputArray.filter((obj) =>
    obj[attribute].toLowerCase().includes(filterValue.toLowerCase()));
};

export const filterObjSubPropValue = (
  inputArray: Array<Object>,
  subArray: string,
  attribute: string,
  filterValue: string,
) => {
  if (filterValue === '') {
    return inputArray;
  }
  return inputArray.filter((obj) => {
    for (const subObj of obj[subArray]) {
      if (subObj[attribute].toLowerCase().includes(filterValue.toLowerCase())) {
        return true;
      }
    }
  });
};

export const filterEqualsValue = (
  inputArray: Array<Object>,
  attribute: string,
  filterValue: string,
) => {
  if (filterValue === '') {
    return inputArray;
  }
  return inputArray.filter((obj) => obj[attribute] === filterValue);
};