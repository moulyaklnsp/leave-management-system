import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

const TITLES = {
  "/dashboard": "Dashboard",
  "/apply-leave": "Apply Leave",
  "/my-leaves": "My Leaves",
  "/all-leaves": "All Leaves",
  "/pending-approvals": "Pending Approvals",
  "/employees": "Employees",
  "/profile": "Profile",
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const title = TITLES[pathname] || "Leave Management";

  return (
    <div className="layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
