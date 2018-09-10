const stateItemName = 'eValgState';

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(stateItemName);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(stateItemName, serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};