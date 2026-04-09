import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// ================= HELPER =================
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use((config) => {

  const stored = localStorage.getItem('examportal_user');
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  // 🔥 AUTO REMOVE EXPIRED TOKEN
  if (token && isTokenExpired(token)) {

    if (refreshToken) {
      // Let response interceptor handle refresh
    } else {
      // No refresh → logout
      localStorage.clear();
      window.location.href = '/login';
      return config;
    }
  }

  // Attach token (skip auth routes)
  if (token && !config.url.includes('/auth')) {
    config.headers.Authorization = 'Bearer ' + token;
  }

  return config;
});

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (res) => res,
  async (err) => {

    if (err.response?.status === 401) {

      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // 🔥 CALL REFRESH API
          const response = await axios.post(
            "http://localhost:8080/auth/refresh",
            { refreshToken }
          );

          const newToken = response.data.data.token;

          // Save new token
          localStorage.setItem("token", newToken);

          // Retry original request
          err.config.headers.Authorization = "Bearer " + newToken;

          return axios(err.config);

        } catch (refreshError) {
          // Refresh failed → logout
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        // No refresh token → logout
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(err);
  }
);

export default api;