import api from "./api.js";

export const applyLeaveApi = (data) => api.post("/leaves", data);

export const getLeavesApi = (params) => api.get("/leaves", { params });

export const getLeaveByIdApi = (id) => api.get(`/leaves/${id}`);

export const updateLeaveApi = (id, data) => api.put(`/leaves/${id}`, data);

export const cancelLeaveApi = (id) => api.delete(`/leaves/${id}`);

export const approveLeaveApi = (id) => api.put(`/leaves/${id}/approve`);

export const rejectLeaveApi = (id, managerComments) =>
  api.put(`/leaves/${id}/reject`, { managerComments });

export const getPendingLeavesApi = (params) =>
  api.get("/leaves/pending", { params });

export const getEmployeeDashboardApi = () => api.get("/leaves/dashboard/employee");

export const getManagerDashboardApi = () => api.get("/leaves/dashboard/manager");
