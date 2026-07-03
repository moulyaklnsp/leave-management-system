import api from "./api.js";

export const getEmployeesApi = (params) => api.get("/employees", { params });

export const getEmployeeByIdApi = (id) => api.get(`/employees/${id}`);

export const getProfileApi = () => api.get("/employees/profile");
