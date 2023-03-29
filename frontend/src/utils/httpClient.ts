import axios, { AxiosInstance, AxiosResponse } from 'axios';

export type ApiReponse<T> = Promise<AxiosResponse<T>>

// export async function getHttpClient(dispatch, state) {
export function getHttpClient(token: string| null): AxiosInstance {
  const api = axios.create();

  // const token = state.config.session.data.token;
  // const exp = state.config.session.data.exp;
  const baseURL = process.env.REACT_APP_API_ENDPOINT;

  // const now = Date.now().valueOf() / 1000;

  api.defaults.baseURL = baseURL;
  if (token !== null) {
    api.defaults.headers.common['Authorization'] = "Bearer " + token;
  }
  
  /*
  try {
    if (exp < now + 60) {
      const data = await refresh(dispatch, state);
      api.defaults.headers.Authorization = 'Bearer ' + data.token;
    }
  } catch (e) {
    return 'Error';
  }
  */
  return api;
}

