import prisma from "../config/prisma.js";

class AuthRepository {
 async updateLastLogin(employeeId) {
  return prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
  });
}
  async deactivateEmployee(employeeId) {
    return prisma.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        isActive: false,
      },
    });
  }

  async activateEmployee(employeeId) {
    return prisma.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        isActive: true,
      },
    });
  }
}

export default new AuthRepository();