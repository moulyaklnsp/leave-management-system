import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getInitials } from "../utils/helpers.js";

const IconDashboard = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const IconCalendar = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconPlus = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconUsers = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconClock = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const IconUser = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const isManager = user?.role === "MANAGER";

  const employeeLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <IconDashboard /> },
    { to: "/apply-leave", label: "Apply Leave", icon: <IconPlus /> },
    { to: "/my-leaves", label: "My Leaves", icon: <IconCalendar /> },
    { to: "/profile", label: "Profile", icon: <IconUser /> },
  ];

  const managerLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <IconDashboard /> },
    { to: "/pending-approvals", label: "Pending Approvals", icon: <IconClock /> },
    { to: "/all-leaves", label: "All Leaves", icon: <IconCalendar /> },
    { to: "/employees", label: "Employees", icon: <IconUsers /> },
    { to: "/profile", label: "Profile", icon: <IconUser /> },
  ];

  const links = isManager ? managerLinks : employeeLinks;

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 99 }} />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#4f46e5" />
            <path d="M8 10h16M8 16h10M8 22h12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span>LeaveMS</span>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <div className="nav-section">{isManager ? "Manager" : "Employee"}</div>
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              onClick={onClose}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div className="avatar">{getInitials(user?.firstName, user?.lastName)}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{user?.role}</div>
            </div>
          </div>
          <button className="btn btn-secondary w-full" onClick={logout}>Logout</button>
        </div>
      </aside>
    </>
  );
}
