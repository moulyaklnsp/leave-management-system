import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = false;
let queue = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (refreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(() => api(original));
      }
      original._retry = true;
      refreshing = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        localStorage.setItem("accessToken", data.data.accessToken);
        queue.forEach(({ resolve }) => resolve());
        queue = [];
        return api(original);
      } catch {
        queue.forEach(({ reject }) => reject());
        queue = [];
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
