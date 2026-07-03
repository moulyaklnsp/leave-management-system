import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getErrorMessage } from "../utils/helpers.js";
import Spinner from "../components/Spinner.jsx";

export default function LoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { role: "" } });

  const onSubmit = async ({ email, password, role }) => {
    setServerError("");
    setLoading(true);
    try {
      const user = await login(email, password);

      // Validate selected role matches actual account role
      if (user.role !== role) {
        setServerError(
          `This account is registered as ${user.role === "MANAGER" ? "a Manager" : "an Employee"}. Please select the correct role.`
        );
        await logout();
        setLoading(false);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none" style={{ margin: "0 auto", display: "block" }}>
            <rect width="32" height="32" rx="8" fill="#4f46e5" />
            <path d="M8 10h16M8 16h10M8 22h12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <h1>Leave Management</h1>
          <p>Sign in to your account</p>
        </div>

        {serverError && (
          <div className="alert alert-error" role="alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">Login As *</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {["EMPLOYEE", "MANAGER"].map((r) => (
                <label
                  key={r}
                  className="role-option"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    border: `2px solid ${errors.role ? "var(--danger)" : "var(--border)"}`,
                    borderRadius: "var(--radius)",
                    cursor: "pointer",
                    background: "var(--surface)",
                    transition: "border-color .15s",
                  }}
                >
                  <input
                    type="radio"
                    value={r}
                    style={{ accentColor: "var(--primary)", width: 16, height: 16 }}
                    {...register("role", { required: "Please select your role" })}
                  />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>
                    {r === "EMPLOYEE" ? "👤 Employee" : "🏢 Manager"}
                  </span>
                </label>
              ))}
            </div>
            {errors.role && <p className="form-error">{errors.role.message}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email ? "error" : ""}`}
              placeholder="you@company.com"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" },
              })}
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password *</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPass ? "text" : "password"}
                className={`form-control ${errors.password ? "error" : ""}`}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ paddingRight: 40 }}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                style={{
                  position: "absolute", right: 10, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  color: "var(--text-muted)", cursor: "pointer",
                }}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? <><Spinner /> Signing in…</> : "Sign In"}
          </button>
        </form>

        {/* Demo credentials */}
        <div style={{ marginTop: 24, padding: 16, background: "var(--gray-50)", borderRadius: 8, fontSize: 13 }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Demo Credentials</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ padding: "8px 10px", background: "var(--success-light)", borderRadius: 6 }}>
              <span style={{ fontWeight: 600, color: "#065f46" }}>🏢 Manager</span>
              <p style={{ margin: "2px 0 0", color: "#065f46" }}>
                <code>manager@company.com</code> / <code>Manager@123</code>
              </p>
            </div>
            <div style={{ padding: "8px 10px", background: "var(--info-light)", borderRadius: 6 }}>
              <span style={{ fontWeight: 600, color: "#1e40af" }}>👤 Employee</span>
              <p style={{ margin: "2px 0 0", color: "#1e40af" }}>
                <code>john@company.com</code> / <code>Employee@123</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
