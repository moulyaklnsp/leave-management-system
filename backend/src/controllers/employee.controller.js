import employeeService from "../services/employee.service.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAllEmployees = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const data = await employeeService.getAll({ page, limit, search });
  return res.status(200).json(new ApiResponse(200, "Employees fetched", data));
});

export const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await employeeService.getById(Number(req.params.id));
  return res.status(200).json(new ApiResponse(200, "Employee fetched", employee));
});

export const getProfile = asyncHandler(async (req, res) => {
  const employee = await employeeService.getProfile(req.user.id);
  return res.status(200).json(new ApiResponse(200, "Profile fetched", employee));
});
