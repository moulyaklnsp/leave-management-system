import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 24 }}>
      <div style={{ fontSize: 80, fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Page Not Found</h1>
      <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
    </div>
  );
}
