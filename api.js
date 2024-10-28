import axios from 'axios';
import { TokenService } from './tokenService';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    if (error.response.status === 403 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = TokenService.getLocalRefreshToken();

      return new Promise(function (resolve, reject) {
        api
          .post('/token/refresh', {
            accessToken: TokenService.getLocalAccessToken(),
            refreshToken: refreshToken,
          })
          .then(({ data }) => {
            TokenService.updateLocalAccessToken(data.accessToken);
            TokenService.updateLocalRefreshToken(data.refreshToken);
            api.defaults.headers.common['Authorization'] =
              'Bearer ' + data.accessToken;
            originalRequest.headers['Authorization'] =
              'Bearer ' + data.accessToken;
            processQueue(null, data.accessToken);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            // Optional: Redirect to login
            window.location.href = '/login';
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
