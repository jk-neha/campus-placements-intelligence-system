import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Loader, EmptyState } from "../../components/States";

export default function AdminCompanies() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = async () => setCompanies(await api.get("/company"));

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


  const remove = async (id) => {
    if (!confirm("Delete this company record? Its postings will be removed too.")) return;
    setBusyId(id);
    setError("");
    try {
      await api.del(`/company/${id}`);
      setSuccess("Company record deleted.");
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loader />;

  return (
  <div>
    <div className="section-heading">
      <h2>Companies</h2>
      <span className="hint">
        {companies.length} record{companies.length === 1 ? "" : "s"}
      </span>
    </div>

    {error && <div className="error-banner">{error}</div>}
    {success && <div className="success-banner">{success}</div>}


    {companies.length === 0 ? (
      <EmptyState title="No company records yet" />
    ) : (
      companies.map((c) => (
        <div className="job-card" key={c.id}>

          <div>
            <div className="job-title">
              {c.company_name}
            </div>

            <div className="job-meta">
              <span>Code {c.company_code}</span>
              <span>Min CGPA {c.minimum_cgpa}</span>
            </div>

            <div className="job-desc">
              {c.required_skills || "No required skills listed"}
            </div>
          </div>


          <button
            className="btn btn-danger btn-sm"
            disabled={busyId === c.id}
            onClick={() => remove(c.id)}
          >
            {busyId === c.id ? "Deleting..." : "Delete"}
          </button>

        </div>
      ))
    )}

  </div>
);
}
