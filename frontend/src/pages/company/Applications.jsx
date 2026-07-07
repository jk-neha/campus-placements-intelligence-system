import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { Loader, EmptyState } from "../../components/States";
import StatusBadge from "../../components/StatusBadge";

const STATUSES = ["Applied", "Under Review", "Shortlisted", "Rejected", "Selected"];

export default function CompanyApplications() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = async (status) => {
    const [apps, jobsRes, studentsRes] = await Promise.all([
      status && status !== "All" ? api.get(`/company/applications/${status}`) : api.get("/company/applications"),
      api.get("/jobs"),
      api.get("/students"),
    ]);
    setApplications(apps);
    setJobs(jobsRes);
    setStudents(studentsRes);
  };

  useEffect(() => {
    (async () => {
      try {
        await load();
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const jobTitle = (id) => jobs.find((j) => j.id === id)?.title || `Role #${id}`;
  const studentName = (id) => students.find((s) => s.id === id)?.name || `Student #${id}`;

  const handleFilterChange = async (value) => {
    setFilter(value);
    setLoading(true);
    setError("");
    try {
      await load(value);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, status) => {
    setUpdatingId(applicationId);
    setError("");
    try {
      await api.put(`/applications/${applicationId}/status`, { status });
      await load(filter);
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="section-heading">
        <h2>Applications</h2>
        <select className="input" style={{ width: "auto" }} value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <Loader />
      ) : applications.length === 0 ? (
        <EmptyState title="No applications here" hint="Try a different status filter, or wait for students to apply." />
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a.id}>
                    <td>{studentName(a.student_id)}</td>
                    <td>{jobTitle(a.job_id)}</td>
                    <td>
                      <StatusBadge status={a.status} />
                    </td>
                    <td>
                      <select
                        className="input"
                        style={{ width: "auto", padding: "6px 10px", fontSize: 13 }}
                        value={a.status}
                        disabled={updatingId === a.id}
                        onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
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
