import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getManagerDashboardApi } from "../services/leave.service.js";
import { formatDate, statusClass, leaveTypeLabel, getErrorMessage } from "../utils/helpers.js";
import Spinner from "../components/Spinner.jsx";

const StatCard = ({ label, value, color, icon }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color + "20" }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
    </div>
    <div>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

export default function ManagerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getManagerDashboardApi()
      .then((r) => setData(r.data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><Spinner size="lg" /></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  const { stats, recentActivities } = data;

  return (
    <div>
      <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
        Here's an overview of all employee leave activity.
      </p>

      <div className="stats-grid">
        <StatCard label="Total Employees" value={stats.totalEmployees} color="#4f46e5" icon="👥" />
        <StatCard label="Pending Approvals" value={stats.pendingApprovals} color="#f59e0b" icon="⏳" />
        <StatCard label="Approved" value={stats.approved} color="#10b981" icon="✅" />
        <StatCard label="Rejected" value={stats.rejected} color="#ef4444" icon="❌" />
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Leave Activities</h2>
          <Link to="/pending-approvals" className="btn btn-primary btn-sm">Review Pending</Link>
        </div>
        {recentActivities.length === 0 ? (
          <div className="empty-state"><p>No recent activities.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{l.employee.firstName} {l.employee.lastName}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{l.employee.employeeCode}</div>
                    </td>
                    <td>{leaveTypeLabel(l.leaveType)}</td>
                    <td>{formatDate(l.startDate)}</td>
                    <td>{formatDate(l.endDate)}</td>
                    <td>{l.totalDays}</td>
                    <td><span className={statusClass(l.status)}>{l.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
