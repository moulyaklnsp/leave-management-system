import { useEffect, useState } from "react";
import { getProfileApi } from "../services/employee.service.js";
import { getErrorMessage, getInitials, formatDate } from "../utils/helpers.js";
import Spinner from "../components/Spinner.jsx";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfileApi()
      .then((r) => setProfile(r.data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><Spinner size="lg" /></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  const { leaveBalance } = profile;

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="card mb-6">
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div className="avatar" style={{ width: 72, height: 72, fontSize: 28, flexShrink: 0 }}>
            {getInitials(profile.firstName, profile.lastName)}
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>{profile.firstName} {profile.lastName}</h2>
            <p style={{ color: "var(--text-muted)" }}>{profile.email}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
              <span className={`badge ${profile.role === "MANAGER" ? "badge-approved" : "badge-pending"}`}>{profile.role}</span>
              <span className="badge badge-cancelled">{profile.department?.name}</span>
              <span className="badge badge-cancelled">{profile.employeeCode}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="card-title" style={{ marginBottom: 16 }}>Account Details</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { label: "First Name", value: profile.firstName },
            { label: "Last Name", value: profile.lastName },
            { label: "Email", value: profile.email },
            { label: "Employee Code", value: profile.employeeCode },
            { label: "Department", value: profile.department?.name },
            { label: "Role", value: profile.role },
            { label: "Status", value: profile.isActive ? "Active" : "Inactive" },
            { label: "Member Since", value: formatDate(profile.createdAt) },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>{label}</div>
              <div style={{ fontWeight: 500 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {leaveBalance && (
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 16 }}>Leave Balance</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
            {[
              { key: "casual", label: "Casual", color: "#4f46e5" },
              { key: "sick", label: "Sick", color: "#ef4444" },
              { key: "earned", label: "Earned", color: "#10b981" },
              { key: "maternity", label: "Maternity", color: "#ec4899" },
              { key: "paternity", label: "Paternity", color: "#3b82f6" },
            ].map(({ key, label, color }) => (
              <div key={key} style={{ textAlign: "center", padding: "16px 8px", background: "var(--gray-50)", borderRadius: 8, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color }}>{leaveBalance[key]}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>days left</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
