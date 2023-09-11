import axios, { AxiosRequestConfig } from 'axios';
import { URL_PREFIX } from '@/app/assets/constants';

// Hàm để thực hiện yêu cầu HTTP
async function fetchDataFromAPI<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  token?: string,
  data?: any
): Promise<T> {

    let useEndpoint:string = URL_PREFIX + endpoint
  const config: AxiosRequestConfig = {
    method,
    url: useEndpoint,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    data: method !== 'GET' ? data : undefined,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error:any) {
    return error.response.data;
  }
}

export {fetchDataFromAPI};