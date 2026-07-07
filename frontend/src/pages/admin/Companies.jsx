import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Loader, EmptyState } from "../../components/States";
import { ChipInput } from "../../components/Chips";

export default function AdminCompanies() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
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

  const startEdit = (c) => {
    setEditingId(c.id);
    setForm({ company_name: c.company_name, minimum_cgpa: c.minimum_cgpa, required_skills: c.required_skills || "" });
    setError("");
    setSuccess("");
  };

  const saveEdit = async (id) => {
    setBusyId(id);
    setError("");
    try {
      await api.put(`/company/${id}`, {
        company_name: form.company_name,
        minimum_cgpa: parseFloat(form.minimum_cgpa) || 0,
        required_skills: form.required_skills,
      });
      setSuccess("Company record updated.");
      setEditingId(null);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

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
        <span className="hint">{companies.length} record{companies.length === 1 ? "" : "s"}</span>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      {companies.length === 0 ? (
        <EmptyState title="No company records yet" />
      ) : (
        companies.map((c) =>
          editingId === c.id ? (
            <div className="card" key={c.id}>
              <div className="field">
                <label>Company name</label>
                <input
                  className="input"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Minimum CGPA</label>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={form.minimum_cgpa}
                  onChange={(e) => setForm({ ...form, minimum_cgpa: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Required skills</label>
                <ChipInput value={form.required_skills} onChange={(v) => setForm({ ...form, required_skills: v })} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary btn-sm" disabled={busyId === c.id} onClick={() => saveEdit(c.id)}>
                  {busyId === c.id ? "Saving…" : "Save"}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="job-card" key={c.id}>
              <div>
                <div className="job-title">{c.company_name}</div>
                <div className="job-meta">
                  <span>Code {c.company_code}</span>
                  <span>Min CGPA {c.minimum_cgpa}</span>
                </div>
                <div className="job-desc">{c.required_skills || "No required skills listed"}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => startEdit(c)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" disabled={busyId === c.id} onClick={() => remove(c.id)}>
                  Delete
                </button>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
}
