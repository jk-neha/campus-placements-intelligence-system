import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { Loader } from "../../components/States";

export default function CompanyDashboard() {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [jobCount, setJobCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [eligibleCount, setEligibleCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = await api.get("/company/me");
        setCompany(me);

        const jobs = await api.get("/jobs");
        setJobCount(jobs.filter((j) => j.company_id === me?.id).length);

        const apps = await api.get("/company/applications");
        setApplicationCount(apps.length);

        const eligible = await api.get("/company/eligible-students");
        setEligibleCount(eligible.length);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  const profileComplete = company?.company_code && company.company_code !== "TEMP";

  return (
    <div>
      {error && <p className="error-banner">{error}</p>}

      {!profileComplete && (
        <div className="card" style={{ borderColor: "var(--brass)", marginBottom: 18 }}>
          <div className="record-title" style={{ color: "var(--brass-deep)" }}>
            Finish setting up your company record
          </div>
          <p className="stat-caption">
            Add your minimum CGPA bar and required skills so the eligibility engine can match students
            against real requirements.
          </p>
          <Link to="/company/profile" className="btn btn-brass btn-sm" style={{ marginTop: 8 }}>
            Complete company record
          </Link>
        </div>
      )}

      <div className="card-row">
        <div className="card">
          <div className="record-title">Postings live</div>
          <div className="stat-value">{jobCount}</div>
          <div className="stat-caption">Open roles under your company</div>
        </div>
        <div className="card">
          <div className="record-title">Applications received</div>
          <div className="stat-value">{applicationCount}</div>
          <div className="stat-caption">Across all your postings</div>
        </div>
        <div className="card">
          <div className="record-title">Eligible students today</div>
          <div className="stat-value">{eligibleCount}</div>
          <div className="stat-caption">Meeting your CGPA and skill bar</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="section-heading">
          <h2>Quick actions</h2>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/company/jobs" className="btn btn-brass">
            Post a new role
          </Link>
          <Link to="/company/applications" className="btn btn-ghost">
            Review applications
          </Link>
          <Link to="/company/eligible-students" className="btn btn-ghost">
            Browse eligible students
          </Link>
        </div>
      </div>
    </div>
  );
}
