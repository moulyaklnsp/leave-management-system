import prisma from "../config/prisma.js";

const leaveInclude = {
  employee: { select: { id: true, firstName: true, lastName: true, email: true, employeeCode: true, department: true } },
  approvedBy: { select: { id: true, firstName: true, lastName: true } },
};

class LeaveRepository {
  async create(data) {
    return prisma.leave.create({ data, include: leaveInclude });
  }

  async findById(id) {
    return prisma.leave.findUnique({ where: { id }, include: leaveInclude });
  }

  async findAll({ skip = 0, take = 10, employeeId, status, leaveType, search = "" }) {
    const where = {
      ...(employeeId && { employeeId }),
      ...(status && { status }),
      ...(leaveType && { leaveType }),
      ...(search && {
        OR: [
          { employee: { firstName: { contains: search } } },
          { employee: { lastName: { contains: search } } },
          { employee: { email: { contains: search } } },
        ],
      }),
    };
    const [leaves, total] = await Promise.all([
      prisma.leave.findMany({ where, skip, take, orderBy: { appliedAt: "desc" }, include: leaveInclude }),
      prisma.leave.count({ where }),
    ]);
    return { leaves, total };
  }

  async update(id, data) {
    return prisma.leave.update({ where: { id }, data, include: leaveInclude });
  }

  async delete(id) {
    return prisma.leave.delete({ where: { id } });
  }

  async countByStatus(employeeId) {
    const results = await prisma.leave.groupBy({
      by: ["status"],
      where: { employeeId },
      _count: { status: true },
    });
    return results.reduce((acc, r) => ({ ...acc, [r.status]: r._count.status }), {});
  }

  async recentByEmployee(employeeId, take = 5) {
    return prisma.leave.findMany({
      where: { employeeId },
      orderBy: { appliedAt: "desc" },
      take,
      include: leaveInclude,
    });
  }

  async pendingCount() {
    return prisma.leave.count({ where: { status: "PENDING" } });
  }

  async globalCountByStatus() {
    const results = await prisma.leave.groupBy({
      by: ["status"],
      _count: { status: true },
    });
    return results.reduce((acc, r) => ({ ...acc, [r.status]: r._count.status }), {});
  }

  async recentAll(take = 10) {
    return prisma.leave.findMany({
      orderBy: { appliedAt: "desc" },
      take,
      include: leaveInclude,
    });
  }
}

export default new LeaveRepository();
