import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getLeavesApi, cancelLeaveApi, updateLeaveApi } from "../services/leave.service.js";
import { formatDate, statusClass, leaveTypeLabel, getErrorMessage } from "../utils/helpers.js";
import Spinner from "../components/Spinner.jsx";
import Pagination from "../components/Pagination.jsx";
import Modal from "../components/Modal.jsx";

const LEAVE_TYPES = ["CASUAL", "SICK", "EARNED", "MATERNITY", "PATERNITY", "UNPAID"];
const STATUSES = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"];

export default function MyLeavesPage() {
  const [leaves, setLeaves] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 10, status: "", leaveType: "", search: "" });
  const [editLeave, setEditLeave] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchLeaves = useCallback(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ""));
    getLeavesApi(params)
      .then((r) => { setLeaves(r.data.data.leaves); setPagination(r.data.data.pagination); })
      .catch((e) => toast.error(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { fetchLeaves(); }, [fetchLeaves]);

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await cancelLeaveApi(cancelId);
      toast.success("Leave cancelled");
      setCancelId(null);
      fetchLeaves();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setCancelLoading(false);
    }
  };

  const openEdit = (leave) => {
    setEditLeave(leave);
    reset({
      leaveType: leave.leaveType,
      startDate: leave.startDate.split("T")[0],
      endDate: leave.endDate.split("T")[0],
      reason: leave.reason,
    });
  };

  const handleEdit = async (data) => {
    setEditLoading(true);
    try {
      await updateLeaveApi(editLeave.id, data);
      toast.success("Leave updated");
      setEditLeave(null);
      fetchLeaves();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div>
      <div className="toolbar">
        <div className="search-input">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="form-control"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
          />
        </div>
        <select className="form-control" style={{ width: "auto" }} value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))}>
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-control" style={{ width: "auto" }} value={filters.leaveType} onChange={(e) => setFilters((f) => ({ ...f, leaveType: e.target.value, page: 1 }))}>
          <option value="">All Types</option>
          {LEAVE_TYPES.map((t) => <option key={t} value={t}>{leaveTypeLabel(t)}</option>)}
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-center"><Spinner size="lg" /></div>
        ) : leaves.length === 0 ? (
          <div className="empty-state">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <p>No leave requests found.</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((l) => (
                    <tr key={l.id}>
                      <td>{leaveTypeLabel(l.leaveType)}</td>
                      <td>{formatDate(l.startDate)}</td>
                      <td>{formatDate(l.endDate)}</td>
                      <td>{l.totalDays}</td>
                      <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.reason}</td>
                      <td><span className={statusClass(l.status)}>{l.status}</span></td>
                      <td>
                        {l.status === "PENDING" && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(l)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => setCancelId(l.id)}>Cancel</button>
                          </div>
                        )}
                        {l.managerComments && (
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }} title={l.managerComments}>💬</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editLeave && (
        <Modal title="Edit Leave Request" onClose={() => setEditLeave(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setEditLeave(null)}>Cancel</button>
              <button className="btn btn-primary" form="edit-form" type="submit" disabled={editLoading}>
                {editLoading ? <><Spinner /> Saving…</> : "Save Changes"}
              </button>
            </>
          }
        >
          <form id="edit-form" onSubmit={handleSubmit(handleEdit)} noValidate>
            <div className="form-group">
              <label className="form-label">Leave Type</label>
              <select className="form-control" {...register("leaveType", { required: true })}>
                {LEAVE_TYPES.map((t) => <option key={t} value={t}>{leaveTypeLabel(t)}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input type="date" className="form-control" {...register("startDate", { required: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input type="date" className="form-control" {...register("endDate", { required: true })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Reason</label>
              <textarea rows={3} className="form-control" {...register("reason", { required: true })} />
            </div>
          </form>
        </Modal>
      )}

      {/* Cancel Confirm Modal */}
      {cancelId && (
        <Modal title="Cancel Leave Request" onClose={() => setCancelId(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setCancelId(null)}>No, Keep It</button>
              <button className="btn btn-danger" onClick={handleCancel} disabled={cancelLoading}>
                {cancelLoading ? <><Spinner /> Cancelling…</> : "Yes, Cancel"}
              </button>
            </>
          }
        >
          <p>Are you sure you want to cancel this leave request? This action cannot be undone.</p>
        </Modal>
      )}
    </div>
  );
}
