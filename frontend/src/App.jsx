import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import ApplyLeavePage from "./pages/ApplyLeavePage.jsx";
import MyLeavesPage from "./pages/MyLeavesPage.jsx";
import AllLeavesPage from "./pages/AllLeavesPage.jsx";
import PendingApprovalsPage from "./pages/PendingApprovalsPage.jsx";
import EmployeesPage from "./pages/EmployeesPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "MANAGER"
    ? <ManagerDashboard />
    : <EmployeeDashboard />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Employee only */}
          <Route element={<ProtectedRoute roles={["EMPLOYEE"]} />}>
            <Route path="/apply-leave" element={<ApplyLeavePage />} />
            <Route path="/my-leaves" element={<MyLeavesPage />} />
          </Route>

          {/* Manager only */}
          <Route element={<ProtectedRoute roles={["MANAGER"]} />}>
            <Route path="/pending-approvals" element={<PendingApprovalsPage />} />
            <Route path="/all-leaves" element={<AllLeavesPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </BrowserRouter>
    </AuthProvider>
  );
}
