import axios from 'axios';

import getAuthHeader from './getAuthHeader';

export const customAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

customAxios.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();
  if (authHeader === null || authHeader === undefined) return config;

  config.headers = {
    ...config.headers,
    Authorization: authHeader,
  };
  console.log(config);
  return config;
});

export default customAxios;
