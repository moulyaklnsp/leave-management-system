import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getEmployeeDashboardApi } from "../services/leave.service.js";
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

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEmployeeDashboardApi()
      .then((r) => setData(r.data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><Spinner size="lg" /></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  const { stats, recentLeaves, leaveBalance } = data;

  return (
    <div>
      <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
        Welcome back, <strong>{user?.firstName}</strong>! Here's your leave overview.
      </p>

      <div className="stats-grid">
        <StatCard label="Total Requests" value={stats.total} color="#4f46e5" icon="📋" />
        <StatCard label="Approved" value={stats.approved} color="#10b981" icon="✅" />
        <StatCard label="Pending" value={stats.pending} color="#f59e0b" icon="⏳" />
        <StatCard label="Rejected" value={stats.rejected} color="#ef4444" icon="❌" />
      </div>

      {leaveBalance && (
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">Leave Balance</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
            {[
              { key: "casual", label: "Casual" },
              { key: "sick", label: "Sick" },
              { key: "earned", label: "Earned" },
              { key: "maternity", label: "Maternity" },
              { key: "paternity", label: "Paternity" },
            ].map(({ key, label }) => (
              <div key={key} style={{ textAlign: "center", padding: "12px 8px", background: "var(--gray-50)", borderRadius: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--primary)" }}>{leaveBalance[key]}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Leave Requests</h2>
          <Link to="/my-leaves" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        {recentLeaves.length === 0 ? (
          <div className="empty-state">
            <p>No leave requests yet.</p>
            <Link to="/apply-leave" className="btn btn-primary" style={{ marginTop: 12 }}>Apply for Leave</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.map((l) => (
                  <tr key={l.id}>
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
