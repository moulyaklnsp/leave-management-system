import prisma from "../config/prisma.js";

class EmployeeRepository {
  async findById(id) {
    return prisma.employee.findUnique({
      where: {
        id,
      },
      include: {
        department: true,
        leaveBalance: true,
      },
    });
  }

  async findByEmail(email) {
    return prisma.employee.findUnique({
      where: {
        email,
      },
      include: {
        department: true,
        leaveBalance: true,
      },
    });
  }

  async create(data) {
    return prisma.employee.create({
      data,
    });
  }

  async update(id, data) {
    return prisma.employee.update({
      where: {
        id,
      },
      data,
    });
  }

  async getAll({
    skip = 0,
    take = 10,
    search = "",
  }) {
    return prisma.employee.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: search,
            },
          },
          {
            lastName: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async count(search = "") {
    return prisma.employee.count({
      where: {
        OR: [
          {
            firstName: {
              contains: search,
            },
          },
          {
            lastName: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
      },
    });
  }
}

export default new EmployeeRepository();