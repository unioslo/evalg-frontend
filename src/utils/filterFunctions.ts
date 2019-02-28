
export const filterObjPropValue = (
  inputArray: any[],
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
  inputArray: any[],
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
  inputArray: any[],
  attribute: string,
  filterValue: string,
) => {
  if (filterValue === '') {
    return inputArray;
  }
  return inputArray.filter((obj) => obj[attribute] === filterValue);
};