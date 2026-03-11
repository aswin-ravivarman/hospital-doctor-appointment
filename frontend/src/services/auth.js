import axios from "axios";

const API_URL = "http://localhost:8080/api/";

const api = axios.create({
  baseURL: API_URL,
});

// Create a separate instance for unauthenticated requests
const publicApi = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers.Authorization = "Bearer " + user.token;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

publicApi.interceptors.request.use(
  (config) => {
    delete config.headers.Authorization;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class AuthService {
  login(email, password) {
    return api
      .post("auth/signin", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(userData) {
    return publicApi.post("auth/signup", userData);
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export const authService = new AuthService();
export default api;
