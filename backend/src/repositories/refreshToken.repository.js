import prisma from "../config/prisma.js";

class RefreshTokenRepository {
  async create(token, employeeId, expiresAt) {
    return prisma.refreshToken.create({
      data: {
        token,
        employeeId,
        expiresAt,
      },
    });
  }

  async findByToken(token) {
    return prisma.refreshToken.findUnique({
        where: {
            token,
        },
        include: {
            employee: {
                include: {
                    department: true,
                    leaveBalance: true,
                },
            },
        },
    });
}

  async deleteByToken(token) {
    return prisma.refreshToken.deleteMany({
        where: {
            token,
        },
    });
}

  async deleteAllForEmployee(employeeId) {
    return prisma.refreshToken.deleteMany({
      where: {
        employeeId,
      },
    });
  }
}
export default new RefreshTokenRepository();