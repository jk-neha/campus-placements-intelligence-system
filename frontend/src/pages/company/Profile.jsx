import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Loader } from "../../components/States";
import { ChipInput } from "../../components/Chips";

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [form, setForm] = useState({ company_name: "", minimum_cgpa: "", required_skills: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const me = await api.get("/company/me");
    setCompany(me);
    setForm({
      company_name: me.company_name || "",
      minimum_cgpa: me.minimum_cgpa ?? "",
      required_skills: me.required_skills || "",
    });
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
    setSaving(true);
    try {
      await api.put(`/company/${company.id}`, {
        company_name: form.company_name,
        minimum_cgpa: parseFloat(form.minimum_cgpa) || 0,
        required_skills: form.required_skills,
      });
      setSuccess("Company record updated.");
      await load();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="section-heading">
        <h2>Company Record</h2>
        <span className="hint">Company code {company?.company_code}</span>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="card" style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="company_name">Company name</label>
            <input
              id="company_name"
              className="input"
              required
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="minimum_cgpa">Minimum CGPA required</label>
            <input
              id="minimum_cgpa"
              className="input"
              type="number"
              step="0.01"
              min="0"
              max="10"
              required
              value={form.minimum_cgpa}
              onChange={(e) => setForm({ ...form, minimum_cgpa: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Required skills</label>
            <ChipInput
              value={form.required_skills}
              onChange={(v) => setForm({ ...form, required_skills: v })}
              placeholder="Type a required skill and press Enter"
            />
            <div className="field-hint">These are matched against every student's skill list.</div>
          </div>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
