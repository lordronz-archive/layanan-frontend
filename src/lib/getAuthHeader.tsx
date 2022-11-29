import getFromLocalStorage from '@/lib/getFromLocalStorage';

const getAuthHeader = (tokenName = 'token') => {
  const token = getFromLocalStorage(tokenName);
  return token ? 'Bearer ' + token.replace(/"/g, '') : null;
};

export default getAuthHeader;
