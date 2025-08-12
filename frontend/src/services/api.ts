import axios from "axios";

const httpInstance = axios.create({
    baseURL : "/api/",
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
})

httpInstance.interceptors.request.use(
  (config : any) => {
    const token = localStorage.getItem('rezal-token');
    const auth = token ? `Bearer ${token}` : '';
    config.headers.common['Authorization'] = auth;
    return config;
  },
  error => Promise.reject(error),
);

httpInstance.interceptors.response.use(
  (response : any) => {
    console.log({ responseReceivedd : response });
    return response
  },
  error => {
    console.log({ errorReceived : error });
    return Promise.reject(error)
  }
);

export default httpInstance;

