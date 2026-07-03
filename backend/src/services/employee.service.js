import employeeRepository from "../repositories/employee.repository.js";
import ApiError from "../utils/ApiError.js";

class EmployeeService {
  async getAll({ page = 1, limit = 10, search = "" }) {
    const skip = (page - 1) * limit;
    const [employees, total] = await Promise.all([
      employeeRepository.getAll({ skip, take: Number(limit), search }),
      employeeRepository.count(search),
    ]);
    return {
      employees: employees.map(({ password, ...e }) => e),
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const employee = await employeeRepository.findById(id);
    if (!employee) throw new ApiError(404, "Employee not found");
    const { password, ...safe } = employee;
    return safe;
  }

  async getProfile(id) {
    return this.getById(id);
  }
}

export default new EmployeeService();
