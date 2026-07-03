export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export const formatDateTime = (d) =>
  d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

export const statusClass = (status) => {
  const map = { PENDING: "badge-pending", APPROVED: "badge-approved", REJECTED: "badge-rejected", CANCELLED: "badge-cancelled" };
  return `badge ${map[status] || ""}`;
};

export const leaveTypeLabel = (type) => {
  const map = { CASUAL: "Casual", SICK: "Sick", EARNED: "Earned", MATERNITY: "Maternity", PATERNITY: "Paternity", UNPAID: "Unpaid" };
  return map[type] || type;
};

export const getInitials = (firstName = "", lastName = "") =>
  `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";
