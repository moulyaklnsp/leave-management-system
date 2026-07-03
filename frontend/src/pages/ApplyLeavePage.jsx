import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { applyLeaveApi } from "../services/leave.service.js";
import { getErrorMessage } from "../utils/helpers.js";
import Spinner from "../components/Spinner.jsx";

const LEAVE_TYPES = ["CASUAL", "SICK", "EARNED", "MATERNITY", "PATERNITY", "UNPAID"];

export default function ApplyLeavePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const startDate = watch("startDate");
  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await applyLeaveApi(data);
      toast.success("Leave applied successfully!");
      navigate("/my-leaves");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Apply for Leave</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="leaveType">Leave Type *</label>
            <select
              id="leaveType"
              className={`form-control ${errors.leaveType ? "error" : ""}`}
              {...register("leaveType", { required: "Leave type is required" })}
            >
              <option value="">Select leave type</option>
              {LEAVE_TYPES.map((t) => (
                <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
              ))}
            </select>
            {errors.leaveType && <p className="form-error">{errors.leaveType.message}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="startDate">Start Date *</label>
              <input
                id="startDate"
                type="date"
                min={today}
                className={`form-control ${errors.startDate ? "error" : ""}`}
                {...register("startDate", { required: "Start date is required" })}
              />
              {errors.startDate && <p className="form-error">{errors.startDate.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="endDate">End Date *</label>
              <input
                id="endDate"
                type="date"
                min={startDate || today}
                className={`form-control ${errors.endDate ? "error" : ""}`}
                {...register("endDate", {
                  required: "End date is required",
                  validate: (v) => !startDate || v >= startDate || "End date must be after start date",
                })}
              />
              {errors.endDate && <p className="form-error">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reason">Reason *</label>
            <textarea
              id="reason"
              rows={4}
              className={`form-control ${errors.reason ? "error" : ""}`}
              placeholder="Briefly describe the reason for your leave..."
              {...register("reason", {
                required: "Reason is required",
                maxLength: { value: 500, message: "Max 500 characters" },
              })}
            />
            {errors.reason && <p className="form-error">{errors.reason.message}</p>}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><Spinner /> Submitting…</> : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
