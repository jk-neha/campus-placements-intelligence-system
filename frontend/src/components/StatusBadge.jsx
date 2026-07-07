const MAP = {
  Applied: "badge-slate",
  "Under Review": "badge-amber",
  Shortlisted: "badge-amber",
  Selected: "badge-moss",
  Rejected: "badge-rust",
};

export default function StatusBadge({ status }) {
  const cls = MAP[status] || "badge-slate";
  return <span className={`badge ${cls}`}>{status}</span>;
}
