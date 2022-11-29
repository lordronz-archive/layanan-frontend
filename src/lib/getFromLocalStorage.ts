export const getFromLocalStorage = (key: string) => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export default getFromLocalStorage;
