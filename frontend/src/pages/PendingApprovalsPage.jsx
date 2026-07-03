import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getPendingLeavesApi, approveLeaveApi, rejectLeaveApi } from "../services/leave.service.js";
import { formatDate, leaveTypeLabel, getErrorMessage } from "../utils/helpers.js";
import Spinner from "../components/Spinner.jsx";
import Pagination from "../components/Pagination.jsx";
import Modal from "../components/Modal.jsx";

export default function PendingApprovalsPage() {
  const [leaves, setLeaves] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rejectLeave, setRejectLeave] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchLeaves = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 10, ...(search && { search }) };
    getPendingLeavesApi(params)
      .then((r) => { setLeaves(r.data.data.leaves); setPagination(r.data.data.pagination); })
      .catch((e) => toast.error(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await approveLeaveApi(id);
      toast.success("Leave approved");
      fetchLeaves();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async ({ managerComments }) => {
    setActionLoading(rejectLeave.id);
    try {
      await rejectLeaveApi(rejectLeave.id, managerComments);
      toast.success("Leave rejected");
      setRejectLeave(null);
      reset();
      fetchLeaves();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="toolbar">
        <div className="search-input" style={{ flex: 1, maxWidth: 360 }}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="form-control"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-center"><Spinner size="lg" /></div>
        ) : leaves.length === 0 ? (
          <div className="empty-state">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>No pending leave requests. All caught up! 🎉</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Applied</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{l.employee.firstName} {l.employee.lastName}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{l.employee.department?.name}</div>
                      </td>
                      <td>{leaveTypeLabel(l.leaveType)}</td>
                      <td>{formatDate(l.startDate)}</td>
                      <td>{formatDate(l.endDate)}</td>
                      <td>{l.totalDays}</td>
                      <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.reason}</td>
                      <td>{formatDate(l.appliedAt)}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            className="btn btn-success btn-sm"
                            disabled={actionLoading === l.id}
                            onClick={() => handleApprove(l.id)}
                          >
                            {actionLoading === l.id ? <Spinner /> : "Approve"}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            disabled={actionLoading === l.id}
                            onClick={() => { setRejectLeave(l); reset(); }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      {rejectLeave && (
        <Modal
          title="Reject Leave Request"
          onClose={() => setRejectLeave(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setRejectLeave(null)}>Cancel</button>
              <button className="btn btn-danger" form="reject-form" type="submit" disabled={!!actionLoading}>
                {actionLoading ? <><Spinner /> Rejecting…</> : "Reject Leave"}
              </button>
            </>
          }
        >
          <p style={{ marginBottom: 12, color: "var(--text-muted)" }}>
            Rejecting leave for <strong>{rejectLeave.employee.firstName} {rejectLeave.employee.lastName}</strong>
          </p>
          <form id="reject-form" onSubmit={handleSubmit(handleReject)} noValidate>
            <div className="form-group">
              <label className="form-label">Reason for Rejection *</label>
              <textarea
                rows={3}
                className={`form-control ${errors.managerComments ? "error" : ""}`}
                placeholder="Provide a reason..."
                {...register("managerComments", { required: "Rejection reason is required" })}
              />
              {errors.managerComments && <p className="form-error">{errors.managerComments.message}</p>}
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
