import leaveService from "../services/leave.service.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const applyLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.applyLeave(
    { ...req.body, employeeId: req.user.id },
    req.ip
  );
  return res.status(201).json(new ApiResponse(201, "Leave applied successfully", leave));
});

export const getLeaves = asyncHandler(async (req, res) => {
  const { page, limit, status, leaveType, search } = req.query;
  const employeeId = req.user.role === "EMPLOYEE" ? req.user.id : undefined;
  const data = await leaveService.getLeaves({ page, limit, employeeId, status, leaveType, search });
  return res.status(200).json(new ApiResponse(200, "Leaves fetched", data));
});

export const getLeaveById = asyncHandler(async (req, res) => {
  const leave = await leaveService.getLeaveById(
    Number(req.params.id),
    req.user.id,
    req.user.role
  );
  return res.status(200).json(new ApiResponse(200, "Leave fetched", leave));
});

export const updateLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.updateLeave(
    Number(req.params.id),
    req.user.id,
    req.body,
    req.ip
  );
  return res.status(200).json(new ApiResponse(200, "Leave updated", leave));
});

export const cancelLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.cancelLeave(Number(req.params.id), req.user.id, req.ip);
  return res.status(200).json(new ApiResponse(200, "Leave cancelled", leave));
});

export const approveLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.approveLeave(Number(req.params.id), req.user.id, req.ip);
  return res.status(200).json(new ApiResponse(200, "Leave approved", leave));
});

export const rejectLeave = asyncHandler(async (req, res) => {
  const { managerComments } = req.body;
  const leave = await leaveService.rejectLeave(
    Number(req.params.id),
    req.user.id,
    managerComments,
    req.ip
  );
  return res.status(200).json(new ApiResponse(200, "Leave rejected", leave));
});

export const getPendingLeaves = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const data = await leaveService.getLeaves({ page, limit, status: "PENDING", search });
  return res.status(200).json(new ApiResponse(200, "Pending leaves fetched", data));
});

export const getEmployeeDashboard = asyncHandler(async (req, res) => {
  const data = await leaveService.getEmployeeDashboard(req.user.id);
  return res.status(200).json(new ApiResponse(200, "Dashboard data fetched", data));
});

export const getManagerDashboard = asyncHandler(async (req, res) => {
  const data = await leaveService.getManagerDashboard();
  return res.status(200).json(new ApiResponse(200, "Dashboard data fetched", data));
});
