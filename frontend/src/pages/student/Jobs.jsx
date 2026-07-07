import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { Loader, EmptyState } from "../../components/States";

export default function StudentJobs() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [applyingId, setApplyingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [jobsRes, companiesRes, appsRes] = await Promise.all([
          api.get("/jobs"),
          api.get("/company"),
          api.get("/student/applications"),
        ]);
        setJobs(jobsRes);
        setCompanies(companiesRes);
        setApplications(appsRes);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const companyName = (id) => companies.find((c) => c.id === id)?.company_name || `Company #${id}`;

  const appliedJobIds = useMemo(
    () => new Set(applications.map((a) => a.job_title + "|" + a.company)),
    [applications]
  );

  const handleApply = async (job) => {
    setApplyingId(job.id);
    setMessage("");
    setError("");
    try {
      await api.post("/apply", { job_id: job.id });
      setMessage(`Applied to ${job.title}.`);
      const appsRes = await api.get("/student/applications");
      setApplications(appsRes);
    } catch (e) {
      setError(e.message);
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="section-heading">
        <h2>Job Board</h2>
        <span className="hint">{jobs.length} open posting{jobs.length === 1 ? "" : "s"}</span>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="success-banner">{message}</div>}

      {jobs.length === 0 ? (
        <EmptyState title="No postings yet" hint="Check back once companies open new roles." />
      ) : (
        jobs.map((job) => {
          const alreadyApplied = appliedJobIds.has(job.title + "|" + companyName(job.company_id));
          return (
            <div className="job-card" key={job.id}>
              <div>
                <div className="job-title">{job.title}</div>
                <div className="job-meta">
                  <span>{companyName(job.company_id)}</span>
                  <span>₹ {job.salary}</span>
                  <span>Apply by {job.deadline}</span>
                </div>
                <div className="job-desc">{job.description}</div>
              </div>
              <button
                className="btn btn-brass btn-sm"
                disabled={applyingId === job.id || alreadyApplied}
                onClick={() => handleApply(job)}
              >
                {alreadyApplied ? "Applied" : applyingId === job.id ? "Applying…" : "Apply"}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
