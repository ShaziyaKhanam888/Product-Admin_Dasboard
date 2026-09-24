import axios from "axios";
import Cookies from "js-cookie";

// 1. Create a pre-configured Axios instance
const api = axios.create({
  baseURL: "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor: Attach Auth Token to outgoing requests
api.interceptors.request.use(
  (config) => {
    //Read the token saved in cookies after login
    const token = Cookies.get("token");

    //If token exists, attach it in the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//3.Response Interceptor: Catch errors globally
api.interceptors.response.use(
  (response) => {
    //Pass successful responses directly through
    return response;
  },
  (error) => {
    //Handle 401 Unauthorized globally (e.g., expired or missing token)
    if (error.response && error.response.status === 401) {
      //Clear local session storage and cookie
      Cookies.remove("token");
      Cookies.remove("user");

      //Redirect to login page if running in the browser

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
