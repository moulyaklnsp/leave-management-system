import leaveRepository from "../repositories/leave.repository.js";
import employeeRepository from "../repositories/employee.repository.js";
import auditRepository from "../repositories/audit.repository.js";
import { sendLeaveAppliedEmail, sendLeaveApprovedEmail, sendLeaveRejectedEmail } from "./email.service.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../config/prisma.js";

const LEAVE_BALANCE_MAP = {
  CASUAL: "casual",
  SICK: "sick",
  EARNED: "earned",
  MATERNITY: "maternity",
  PATERNITY: "paternity",
  UNPAID: "unpaid",
};

function calcWorkingDays(start, end) {
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

class LeaveService {
  async applyLeave({ employeeId, leaveType, startDate, endDate, reason }, ipAddress) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) throw new ApiError(400, "Start date must be before end date");
    if (start < new Date(new Date().setHours(0, 0, 0, 0)))
      throw new ApiError(400, "Cannot apply leave for past dates");

    const totalDays = calcWorkingDays(start, end);
    if (totalDays === 0) throw new ApiError(400, "No working days in selected range");

    // Check balance
    const balance = await prisma.leaveBalance.findUnique({ where: { employeeId } });
    if (!balance) throw new ApiError(400, "Leave balance not found");

    const balanceKey = LEAVE_BALANCE_MAP[leaveType];
    if (balance[balanceKey] < totalDays && leaveType !== "UNPAID") {
      throw new ApiError(400, `Insufficient ${leaveType.toLowerCase()} leave balance`);
    }

    // Check overlapping
    const overlap = await prisma.leave.findFirst({
      where: {
        employeeId,
        status: { in: ["PENDING", "APPROVED"] },
        OR: [
          { startDate: { lte: end }, endDate: { gte: start } },
        ],
      },
    });
    if (overlap) throw new ApiError(409, "You already have a leave request overlapping these dates");

    const leave = await leaveRepository.create({
      employeeId,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      status: "PENDING",
    });

    await auditRepository.create({
      employeeId,
      action: "APPLY_LEAVE",
      entity: "Leave",
      entityId: leave.id,
      description: `Applied ${leaveType} leave for ${totalDays} day(s)`,
      ipAddress,
    });

    const emp = await employeeRepository.findById(employeeId);
    sendLeaveAppliedEmail(emp, leave).catch(() => {});

    return leave;
  }

  async getLeaves({ page = 1, limit = 10, employeeId, status, leaveType, search }) {
    const skip = (page - 1) * limit;
    const { leaves, total } = await leaveRepository.findAll({
      skip,
      take: Number(limit),
      employeeId,
      status,
      leaveType,
      search,
    });
    return {
      leaves,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    };
  }

  async getLeaveById(id, requesterId, requesterRole) {
    const leave = await leaveRepository.findById(id);
    if (!leave) throw new ApiError(404, "Leave not found");
    if (requesterRole === "EMPLOYEE" && leave.employeeId !== requesterId)
      throw new ApiError(403, "Access denied");
    return leave;
  }

  async updateLeave(id, employeeId, data, ipAddress) {
    const leave = await leaveRepository.findById(id);
    if (!leave) throw new ApiError(404, "Leave not found");
    if (leave.employeeId !== employeeId) throw new ApiError(403, "Access denied");
    if (leave.status !== "PENDING") throw new ApiError(400, "Only pending leaves can be edited");

    const start = new Date(data.startDate || leave.startDate);
    const end = new Date(data.endDate || leave.endDate);
    if (start > end) throw new ApiError(400, "Start date must be before end date");

    const totalDays = calcWorkingDays(start, end);

    const updated = await leaveRepository.update(id, {
      leaveType: data.leaveType || leave.leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason: data.reason || leave.reason,
    });

    await auditRepository.create({
      employeeId,
      action: "UPDATE_LEAVE",
      entity: "Leave",
      entityId: id,
      description: `Updated leave request`,
      ipAddress,
    });

    return updated;
  }

  async cancelLeave(id, employeeId, ipAddress) {
    const leave = await leaveRepository.findById(id);
    if (!leave) throw new ApiError(404, "Leave not found");
    if (leave.employeeId !== employeeId) throw new ApiError(403, "Access denied");
    if (leave.status !== "PENDING") throw new ApiError(400, "Only pending leaves can be cancelled");

    const updated = await leaveRepository.update(id, { status: "CANCELLED" });

    await auditRepository.create({
      employeeId,
      action: "CANCEL_LEAVE",
      entity: "Leave",
      entityId: id,
      description: `Cancelled leave request`,
      ipAddress,
    });

    return updated;
  }

  async approveLeave(id, managerId, ipAddress) {
    const leave = await leaveRepository.findById(id);
    if (!leave) throw new ApiError(404, "Leave not found");
    if (leave.status !== "PENDING") throw new ApiError(400, "Only pending leaves can be approved");

    const balanceKey = LEAVE_BALANCE_MAP[leave.leaveType];
    await prisma.leaveBalance.update({
      where: { employeeId: leave.employeeId },
      data: { [balanceKey]: { decrement: leave.totalDays } },
    });

    const updated = await leaveRepository.update(id, {
      status: "APPROVED",
      approvedById: managerId,
      approvedAt: new Date(),
    });

    await auditRepository.create({
      employeeId: managerId,
      action: "APPROVE_LEAVE",
      entity: "Leave",
      entityId: id,
      description: `Approved leave for employee #${leave.employeeId}`,
      ipAddress,
    });

    const emp = await employeeRepository.findById(leave.employeeId);
    sendLeaveApprovedEmail(emp, updated).catch(() => {});

    return updated;
  }

  async rejectLeave(id, managerId, managerComments, ipAddress) {
    const leave = await leaveRepository.findById(id);
    if (!leave) throw new ApiError(404, "Leave not found");
    if (leave.status !== "PENDING") throw new ApiError(400, "Only pending leaves can be rejected");

    const updated = await leaveRepository.update(id, {
      status: "REJECTED",
      approvedById: managerId,
      managerComments,
    });

    await auditRepository.create({
      employeeId: managerId,
      action: "REJECT_LEAVE",
      entity: "Leave",
      entityId: id,
      description: `Rejected leave for employee #${leave.employeeId}`,
      ipAddress,
    });

    const emp = await employeeRepository.findById(leave.employeeId);
    sendLeaveRejectedEmail(emp, updated, managerComments).catch(() => {});

    return updated;
  }

  async getEmployeeDashboard(employeeId) {
    const [counts, recent, balance] = await Promise.all([
      leaveRepository.countByStatus(employeeId),
      leaveRepository.recentByEmployee(employeeId, 5),
      prisma.leaveBalance.findUnique({ where: { employeeId } }),
    ]);
    return {
      stats: {
        total: Object.values(counts).reduce((a, b) => a + b, 0),
        approved: counts.APPROVED || 0,
        pending: counts.PENDING || 0,
        rejected: counts.REJECTED || 0,
        cancelled: counts.CANCELLED || 0,
      },
      recentLeaves: recent,
      leaveBalance: balance,
    };
  }

  async getManagerDashboard() {
    const [totalEmployees, pendingCount, statusCounts, recent] = await Promise.all([
      prisma.employee.count({ where: { role: "EMPLOYEE", isActive: true } }),
      leaveRepository.pendingCount(),
      leaveRepository.globalCountByStatus(),
      leaveRepository.recentAll(10),
    ]);
    return {
      stats: {
        totalEmployees,
        pendingApprovals: pendingCount,
        approved: statusCounts.APPROVED || 0,
        rejected: statusCounts.REJECTED || 0,
      },
      recentActivities: recent,
    };
  }
}

export default new LeaveService();
