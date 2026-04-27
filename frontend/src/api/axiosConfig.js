import axios from 'axios';
import { clearLocalAuthState } from '../utils/authSession';
const api = axios.create({ baseURL: window.location.origin,});
api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('examportal_user');

    if (stored) {
      const parsed = JSON.parse(stored);

      if (parsed?.token) {
        config.headers.Authorization = 'Bearer ' + parsed.token;
      }

      if (parsed?.sessionToken) {
        config.headers["X-Session-Token"] = parsed.sessionToken;
      }
    }
  } catch (e) {
    console.error("Storage parse error:", e);
    clearLocalAuthState();
  }

  return config;
});

api.interceptors.response.use((res) => res, (err) => {
  const status = err.response?.status;
  const requestUrl = String(err.config?.url || '');
  const isAuthRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

  if (status === 401 && !isAuthRequest) {
    alert("Session expired or logged in from another device");
    clearLocalAuthState();
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  return Promise.reject(err);
});
export default api;
