import { useEffect, useState, useCallback } from "react";
import { getEmployeesApi } from "../services/employee.service.js";
import { getErrorMessage, getInitials } from "../utils/helpers.js";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner.jsx";
import Pagination from "../components/Pagination.jsx";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchEmployees = useCallback(() => {
    setLoading(true);
    getEmployeesApi({ page, limit: 10, ...(search && { search }) })
      .then((r) => { setEmployees(r.data.data.employees); setPagination(r.data.data.pagination); })
      .catch((e) => toast.error(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  return (
    <div>
      <div className="toolbar">
        <div className="search-input" style={{ flex: 1, maxWidth: 360 }}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="form-control"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-center"><Spinner size="lg" /></div>
        ) : employees.length === 0 ? (
          <div className="empty-state"><p>No employees found.</p></div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Code</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e) => (
                    <tr key={e.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                            {getInitials(e.firstName, e.lastName)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 500 }}>{e.firstName} {e.lastName}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{e.employeeCode}</td>
                      <td>{e.email}</td>
                      <td>{e.department?.name}</td>
                      <td>
                        <span className={`badge ${e.role === "MANAGER" ? "badge-approved" : "badge-pending"}`}>
                          {e.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${e.isActive ? "badge-approved" : "badge-rejected"}`}>
                          {e.isActive ? "Active" : "Inactive"}
                        </span>
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
    </div>
  );
}
