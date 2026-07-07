import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Loader, EmptyState } from "../../components/States";

const emptyForm = { title: "", description: "", salary: "", deadline: "", status: "Open" };

export default function CompanyJobs() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [posting, setPosting] = useState(false);

  const load = async () => {
    const me = await api.get("/company/me");
    setCompany(me);
    const allJobs = await api.get("/jobs");
    setJobs(allJobs.filter((j) => j.company_id === me?.id));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPosting(true);
    try {
      await api.post("/jobs", form);
      setSuccess("Role posted.");
      setForm(emptyForm);
      await load();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="section-heading">
        <h2>Postings</h2>
        <span className="hint">{jobs.length} role{jobs.length === 1 ? "" : "s"} under {company?.company_name}</span>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="card">
        <div className="record-title">Post a new role</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              className="input"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Backend Engineer, New Grad"
            />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="input"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What the role involves and who should apply"
            />
          </div>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="salary">Salary</label>
              <input
                id="salary"
                className="input"
                required
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                placeholder="e.g. 8 LPA"
              />
            </div>
            <div className="field">
              <label htmlFor="deadline">Application deadline</label>
              <input
                id="deadline"
                className="input"
                type="date"
                required
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>
          <button className="btn btn-brass" disabled={posting}>
            {posting ? "Posting…" : "Post role"}
          </button>
        </form>
      </div>

      <div className="section-heading" style={{ marginTop: 24 }}>
        <h2>Your postings</h2>
      </div>

      {jobs.length === 0 ? (
        <EmptyState title="No postings yet" hint="Use the form above to publish your first role." />
      ) : (
        jobs.map((job) => (
          <div className="job-card" key={job.id}>
            <div>
              <div className="job-title">{job.title}</div>
              <div className="job-meta">
                <span>₹ {job.salary}</span>
                <span>Deadline {job.deadline}</span>
              </div>
              <div className="job-desc">{job.description}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
