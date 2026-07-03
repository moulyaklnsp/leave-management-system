import prisma from "../config/prisma.js";

class AuditRepository {
  async create({ employeeId, action, entity, entityId, description, ipAddress }) {
    return prisma.auditLog.create({
      data: { employeeId, action, entity, entityId: Number(entityId), description, ipAddress },
    });
  }

  async findAll({ skip = 0, take = 20 }) {
    return prisma.auditLog.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { employee: { select: { firstName: true, lastName: true, email: true } } },
    });
  }
}

export default new AuditRepository();
