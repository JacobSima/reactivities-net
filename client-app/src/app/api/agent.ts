import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { Activity } from "../models/activity";
import {history} from '../../index';
import { store } from "../stores/store";
import { User, UserFormValues } from "../models/user";

const sleep = (delay: number) => new Promise(resolve => setTimeout(resolve,delay));

axios.defaults.baseURL = 'http://localhost:5000/api';

// Use Axios Intercepter with the Request
// Send JWT in request as we can do it with postman
axios.interceptors.request.use(config => {
  const token = store.commonStore.token;
  if(token) config.headers.Authorization =`Bearer ${token}`;
  return config;

})

// Use Axios Intercepter with the Response from server to Manage the Error messages
axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
},(error: AxiosError) => {
  const {data, status, config} = error.response!;
  switch(status){

    // 400 from,Bad-request,Bad-Guid and Validation Error
    case 400:
      if(typeof data === 'string') toast.error(data);

      if(config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/not-found');
      }  

      if(data.errors){
        const modalStateError = [];
        for(const key in data.errors){
          if(data.errors[key]){
            modalStateError.push(data.errors[key])
          }
        }
        throw modalStateError.flat();
      }
      break;


    case 401:
      toast.error('unauthorised');
      break;
    case 404:
      history.push('/not-found');
      break;

    // Server Error Handling using Store and redirect to a server-error component
    case 500:
      store.commonStore.setServerError(data);
      history.push('/server-error');
      break;

    default:
      return Promise.reject(error);
  }
})

const responseBody = <T> (response : AxiosResponse<T>) => response.data; 

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
  list: () => requests.get<Activity[]>('/activities'),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => requests.post<void>('/activities',activity),
  update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`)
}

const Account = {
  current: () => requests.get<User>('/account'),
  login: (user: UserFormValues) => requests.post<User>('/account/login', user),
  register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const agent = {
  Activities,
  Account 
}

export default agent;