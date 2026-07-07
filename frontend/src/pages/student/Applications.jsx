import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Loader, EmptyState } from "../../components/States";
import StatusBadge from "../../components/StatusBadge";

export default function StudentApplications() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setApplications(await api.get("/student/applications"));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="section-heading">
        <h2>My Applications</h2>
        <span className="hint">{applications.length} total</span>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {applications.length === 0 ? (
        <EmptyState title="No applications yet" hint="Apply to a posting from the Job Board to see it tracked here." />
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Salary</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a.application_id}>
                    <td>{a.job_title}</td>
                    <td>{a.company}</td>
                    <td>₹ {a.salary}</td>
                    <td>{a.deadline}</td>
                    <td>
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
