import { useEffect, useRef, useState } from "react";
import { api } from "../../lib/api";
import { Loader } from "../../components/States";
import { ChipInput } from "../../components/Chips";

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({ name: "", cgpa: "", department: "", skills: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [foundSkills, setFoundSkills] = useState(null);
  const fileRef = useRef(null);

  const load = async () => {
    const me = await api.get("/student/me");
    setStudent(me);
    setForm({
      name: me.name || "",
      cgpa: me.cgpa ?? "",
      department: me.department || "",
      skills: me.skills || "",
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
      await api.put(`/students/${student.id}`, {
        name: form.name,
        cgpa: parseFloat(form.cgpa) || 0,
        department: form.department,
        skills: form.skills,
      });
      setSuccess("Your record has been updated.");
      await load();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setFoundSkills(null);
    try {
      const result = await api.uploadResume(file);
      setFoundSkills(result.skills || []);
      await load();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="section-heading">
        <h2>My Record</h2>
        <span className="hint">Registration no. {student?.registration_number}</span>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="card-row" style={{ alignItems: "stretch" }}>
        <div className="card" style={{ flex: 2, minWidth: 320 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  className="input"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="cgpa">CGPA</label>
                <input
                  id="cgpa"
                  className="input"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={form.cgpa}
                  onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="department">Department</label>
              <input
                id="department"
                className="input"
                required
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="Computer Science"
              />
            </div>
            <div className="field">
              <label>Skills</label>
              <ChipInput value={form.skills} onChange={(v) => setForm({ ...form, skills: v })} />
              <div className="field-hint">Press Enter or comma after each skill.</div>
            </div>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>

        <div className="card" style={{ flex: 1, minWidth: 260 }}>
          <div className="record-title">Resume scan</div>
          <p className="stat-caption">
            Upload a PDF resume and we'll pull out recognized skills and add them to your record
            automatically.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            style={{ marginTop: 12, fontSize: 13 }}
            disabled={uploading}
          />
          {uploading && <Loader label="Scanning resume…" />}
          {foundSkills && (
            <div style={{ marginTop: 12 }}>
              <div className="record-title">Skills found</div>
              {foundSkills.length ? (
                <div className="chip-list">
                  {foundSkills.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="stat-caption">No recognized skills found in this file.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
