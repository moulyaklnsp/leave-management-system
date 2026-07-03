export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages, total, limit } = pagination;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="pagination">
      <span className="pagination-info">Showing {from}–{to} of {total}</span>
      <div className="pagination-btns">
        <button className="page-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>‹</button>
        {Array.from({ length: pages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1)
          .reduce((acc, p, i, arr) => {
            if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === "..." ? (
              <span key={`e${i}`} className="page-btn" style={{ cursor: "default" }}>…</span>
            ) : (
              <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => onPageChange(p)}>{p}</button>
            )
          )}
        <button className="page-btn" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>›</button>
      </div>
    </div>
  );
}
