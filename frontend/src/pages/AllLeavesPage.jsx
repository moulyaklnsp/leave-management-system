import { useEffect, useState, useCallback } from "react";
import { getLeavesApi } from "../services/leave.service.js";
import { formatDate, statusClass, leaveTypeLabel, getErrorMessage } from "../utils/helpers.js";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner.jsx";
import Pagination from "../components/Pagination.jsx";

const LEAVE_TYPES = ["CASUAL", "SICK", "EARNED", "MATERNITY", "PATERNITY", "UNPAID"];
const STATUSES = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"];

export default function AllLeavesPage() {
  const [leaves, setLeaves] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: "", leaveType: "", search: "" });

  const fetchLeaves = useCallback(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ""));
    getLeavesApi(params)
      .then((r) => { setLeaves(r.data.data.leaves); setPagination(r.data.data.pagination); })
      .catch((e) => toast.error(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  return (
    <div>
      <div className="toolbar">
        <div className="search-input" style={{ flex: 1 }}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="form-control"
            placeholder="Search employee..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
          />
        </div>
        <select className="form-control" style={{ width: "auto" }} value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))}>
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-control" style={{ width: "auto" }} value={filters.leaveType} onChange={(e) => setFilters((f) => ({ ...f, leaveType: e.target.value, page: 1 }))}>
          <option value="">All Types</option>
          {LEAVE_TYPES.map((t) => <option key={t} value={t}>{leaveTypeLabel(t)}</option>)}
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-center"><Spinner size="lg" /></div>
        ) : leaves.length === 0 ? (
          <div className="empty-state"><p>No leave records found.</p></div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Manager Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{l.employee.firstName} {l.employee.lastName}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{l.employee.employeeCode}</div>
                      </td>
                      <td>{l.employee.department?.name}</td>
                      <td>{leaveTypeLabel(l.leaveType)}</td>
                      <td>{formatDate(l.startDate)}</td>
                      <td>{formatDate(l.endDate)}</td>
                      <td>{l.totalDays}</td>
                      <td><span className={statusClass(l.status)}>{l.status}</span></td>
                      <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: 13 }}>
                        {l.managerComments || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
          </>
        )}
      </div>
    </div>
  );
}
