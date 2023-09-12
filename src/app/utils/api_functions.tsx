import axios, { AxiosRequestConfig } from 'axios';
import { ACCESS_TOKEN, URL_PREFIX } from '@/app/assets/constants';
import jwt_decode from "jwt-decode";
import { formatDistanceToNow, parse, getTime } from 'date-fns';
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';

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
export const checkToken = (accessToken:string) => {

  if (accessToken) {
    try {
      const decoded:any = jwt_decode(accessToken)
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp > currentTime) {
        // Xử lý khi token đã hết hạn, ví dụ như đăng xuất người dùng
        return true
      }
      else {
        console.log("Token hết hạn")
      }
    } catch (error) {
      console.error('Lỗi xác minh token:', error);
      // Xử lý khi có lỗi xác minh token
    }
  }
  return false
}

export const getTheTime = (time:string) => {
  function capitalize(str:string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const timestamp = time
  const parsedDate = parse(timestamp, 'MM/dd/yyyy - HH:mm:ss', new Date())

  const milliseconds = getTime(parsedDate);
  const timeAgo = formatDistanceToNow(milliseconds, { addSuffix: true })
  return capitalize(timeAgo)
}

export const uploadDataFileApi = async (endpoint:string, access_token?:string, method = 'POST', data?:any) => {
  const url = `${URL_PREFIX}${endpoint}`
  const config = {
    method,
    url,
    maxBodyLength: Infinity,
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data',
    },
    data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error:any) {
    return error.response
  }
};


export const checkLoginUser = () => {
  let token = localStorage.getItem(ACCESS_TOKEN) ?? ""
  return token && checkToken(token)
}
export {fetchDataFromAPI};