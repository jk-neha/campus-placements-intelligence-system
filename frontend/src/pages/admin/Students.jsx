import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Loader, EmptyState } from "../../components/States";
import { ChipInput } from "../../components/Chips";

export default function AdminStudents() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = async () => setStudents(await api.get("/students"));

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

  const startEdit = (s) => {
    setEditingId(s.id);
    setForm({ name: s.name, cgpa: s.cgpa, department: s.department, skills: s.skills || "" });
    setError("");
    setSuccess("");
  };

  const saveEdit = async (id) => {
    setBusyId(id);
    setError("");
    try {
      await api.put(`/students/${id}`, {
        name: form.name,
        cgpa: parseFloat(form.cgpa) || 0,
        department: form.department,
        skills: form.skills,
      });
      setSuccess("Student record updated.");
      setEditingId(null);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this student record? This cannot be undone.")) return;
    setBusyId(id);
    setError("");
    try {
      await api.del(`/students/${id}`);
      setSuccess("Student record deleted.");
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
        <h2>Students</h2>
        <span className="hint">{students.length} record{students.length === 1 ? "" : "s"}</span>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      {students.length === 0 ? (
        <EmptyState title="No student records yet" />
      ) : (
        students.map((s) =>
          editingId === s.id ? (
            <div className="card" key={s.id}>
              <div className="form-grid">
                <div className="field">
                  <label>Name</label>
                  <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="field">
                  <label>CGPA</label>
                  <input
                    className="input"
                    type="number"
                    step="0.01"
                    value={form.cgpa}
                    onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
                  />
                </div>
              </div>
              <div className="field">
                <label>Department</label>
                <input
                  className="input"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Skills</label>
                <ChipInput value={form.skills} onChange={(v) => setForm({ ...form, skills: v })} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary btn-sm" disabled={busyId === s.id} onClick={() => saveEdit(s.id)}>
                  {busyId === s.id ? "Saving…" : "Save"}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="job-card" key={s.id}>
              <div>
                <div className="job-title">{s.name}</div>
                <div className="job-meta">
                  <span>Reg. {s.registration_number}</span>
                  <span>{s.department}</span>
                  <span>CGPA {s.cgpa}</span>
                </div>
                <div className="job-desc">{s.skills || "No skills listed"}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => startEdit(s)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" disabled={busyId === s.id} onClick={() => remove(s.id)}>
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
