import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { Loader } from "../../components/States";
import Gauge from "../../components/Gauge";
import StatusBadge from "../../components/StatusBadge";

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [topMatch, setTopMatch] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = await api.get("/student/me");
        setStudent(me);

        const apps = await api.get("/student/applications");
        setApplications(apps);

        if (me?.id) {
          const recs = await api.get(`/recommendations/${me.id}`);
          setTopMatch(recs?.[0] || null);
        }
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  const skillCount = student?.skills ? student.skills.split(",").filter(Boolean).length : 0;
  const profileComplete = student?.registration_number && student.registration_number !== "TEMP";

  return (
    <div>
      {err && <p className="error-banner">{err}</p>}

      {!profileComplete && (
        <div className="card" style={{ borderColor: "var(--brass)", marginBottom: 18 }}>
          <div className="record-title" style={{ color: "var(--brass-deep)" }}>
            Finish setting up your record
          </div>
          <p className="stat-caption">
            Your registration number is still a placeholder. Add your CGPA, department, and skills so
            recruiters and the eligibility checker can see an accurate picture.
          </p>
          <Link to="/student/profile" className="btn btn-brass btn-sm" style={{ marginTop: 8 }}>
            Complete my record
          </Link>
        </div>
      )}

      <div className="card-row">
        <div className="card">
          <div className="record-title">CGPA on file</div>
          <div className="stat-value">{student?.cgpa ?? "—"}</div>
          <div className="stat-caption">Used for every eligibility check</div>
        </div>
        <div className="card">
          <div className="record-title">Skills listed</div>
          <div className="stat-value">{skillCount}</div>
          <div className="stat-caption">Matched against company requirements</div>
        </div>
        <div className="card">
          <div className="record-title">Applications sent</div>
          <div className="stat-value">{applications.length}</div>
          <div className="stat-caption">Across every posting you've applied to</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="section-heading">
          <h2>Your top match</h2>
          <Link to="/student/recommendations" className="hint">
            See all recommendations →
          </Link>
        </div>
        {topMatch ? (
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <Gauge score={topMatch.readiness_score} size={84} />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>
                {topMatch.company}
              </div>
              <div className="stat-caption" style={{ marginTop: 4 }}>
                {topMatch.eligible ? "You meet the eligibility bar today." : "Close some skill gaps to become eligible."}
              </div>
            </div>
          </div>
        ) : (
          <p className="stat-caption">No companies on record yet — check back once postings open.</p>
        )}
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="section-heading">
          <h2>Recent applications</h2>
          <Link to="/student/applications" className="hint">
            View all →
          </Link>
        </div>
        {applications.length === 0 ? (
          <p className="stat-caption">You haven't applied to anything yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((a) => (
                  <tr key={a.application_id}>
                    <td>{a.job_title}</td>
                    <td>{a.company}</td>
                    <td>
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
