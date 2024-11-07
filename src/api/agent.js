import axios from "axios";
import sleep from "@/utils/sleep";
import { parseFormData } from "@/utils/formData";
import createAuthRefreshInterceptor from "axios-auth-refresh";

import { useAuthStore } from "@/stores/_core/authStore";
import { toast } from "vue3-toastify";

// Base URL
// -- development: https://localhost:7250/api
// -- production: (your domain)
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

// Send up the token with every request, when there is a token
axios.interceptors.request.use((config) => {
  let authStore = useAuthStore();
  const token = authStore.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Axios reponse interceptors
axios.interceptors.response.use(
  async (response) => {
    if (import.meta.env.MODE === "development") await sleep(100); // artifical delay for development
    return response;
  },
  (error) => {
    // basic error handling for 400 and 500 type errors
    const { data, status } = error.response;
    switch (status) {
      case 400:
        toast.error("Error code 400: bad request");
        console.log(data);
        break;
      case 401:
        // 401 unauthorized is handled by axios-auth-refresh and refreshAuthLogic function
        break;
      case 403:
        toast.error("Not authorized");
        break;
      case 500:
        toast.error("Error code 500: internal server error");
        console.log(data);
        break;
    }
    return Promise.reject(error);
  }
);

// Function that will be called to refresh authorization
const refreshAuthLogic = (failedRequest) =>
  agent.get("/tokens/" + useAuthStore().refreshToken).then((response) => {
    if (!response.succeeded) {
      useAuthStore().logout(); // if refresh token expired
    } else {
      useAuthStore().currentToken = response.data.token; // set new jwt auth token in local storage
      failedRequest.response.config.headers["Authorization"] = "Bearer " + response.data.token; // set new jwt auth token in the retry attempt
      return Promise.resolve();
    }
  });

createAuthRefreshInterceptor(axios, refreshAuthLogic);

// Axios Base
const responseBody = (response) => response.data;
const agent = {
  get: (url) => axios.get(url).then(responseBody),
  post: (url, body) => axios.post(url, body).then(responseBody),
  postFormData: (url, body) => {
    const formData = parseFormData(body);
    return axios.post(url, formData, { headers: { "Content-type": "multipart/form-data" } }).then(responseBody);
  },
  put: (url, body, options) => axios.put(url, body, options).then(responseBody),
  putFormData: (url, body) => {
    const formData = parseFormData(body);
    return axios.put(url, formData, { headers: { "Content-type": "multipart/form-data" } }).then(responseBody);
  },
  delete: (url) => axios.delete(url).then(responseBody),
};

export default agent;
