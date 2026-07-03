import api from "./api.js";

export const loginApi = (email, password) =>
  api.post("/auth/login", { email, password });

export const logoutApi = () => api.post("/auth/logout");

export const refreshApi = () => api.post("/auth/refresh");
