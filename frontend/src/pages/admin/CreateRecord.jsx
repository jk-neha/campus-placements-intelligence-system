import { useState } from "react";
import { api } from "../../lib/api";

const TABS = [
  { key: "student", label: "Student" },
  { key: "company", label: "Company" },
];

const emptyStudent = { registration_number: "", name: "", email: "", password: "", department: "" };
const emptyCompany = { company_code: "", company_name: "", email: "", password: "" };


export default function AdminCreate() {
  const [tab, setTab] = useState("student");
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [companyForm, setCompanyForm] = useState(emptyCompany);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setError("");
    setSuccess("");
  };

  const submitStudent = async (e) => {
    e.preventDefault();
    reset();
    setBusy(true);
    try {
      const res = await api.post("/admin/create-student", studentForm);
      setSuccess(`Student "${res.student.name}" created (reg. ${res.student.registration_number}).`);
      setStudentForm(emptyStudent);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const submitCompany = async (e) => {
    e.preventDefault();
    reset();
    setBusy(true);
    try {
      const res = await api.post("/admin/create-company", companyForm);
      setSuccess(`Company "${res.company.company_name}" created.`);
      setCompanyForm(emptyCompany);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };


  return (
    <div>
      <div className="section-heading">
        <h2>Add a Record</h2>
      </div>

      <div className="role-pick" style={{ maxWidth: 320, gridTemplateColumns: "repeat(2, 1fr)" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={tab === t.key ? "active" : ""}
            onClick={() => {
              setTab(t.key);
              reset();
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="card" style={{ maxWidth: 520 }}>
        {tab === "student" && (
          <form onSubmit={submitStudent}>
            <div className="field">
              <label>Registration number</label>
              <input
                className="input"
                required
                value={studentForm.registration_number}
                onChange={(e) => setStudentForm({ ...studentForm, registration_number: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Name</label>
              <input
                className="input"
                required
                value={studentForm.name}
                onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                type="email"
                required
                value={studentForm.email}
                onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Temporary password</label>
              <input
                className="input"
                type="password"
                required
                value={studentForm.password}
                onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Department</label>
              <input
                className="input"
                required
                value={studentForm.department}
                onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" disabled={busy}>
              {busy ? "Creating…" : "Create student record"}
            </button>
          </form>
        )}

        {tab === "company" && (
          <form onSubmit={submitCompany}>
            <div className="field">
              <label>Company code</label>
              <input
                className="input"
                required
                value={companyForm.company_code}
                onChange={(e) => setCompanyForm({ ...companyForm, company_code: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Company name</label>
              <input
                className="input"
                required
                value={companyForm.company_name}
                onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                type="email"
                required
                value={companyForm.email}
                onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Temporary password</label>
              <input
                className="input"
                type="password"
                required
                value={companyForm.password}
                onChange={(e) => setCompanyForm({ ...companyForm, password: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" disabled={busy}>
              {busy ? "Creating…" : "Create company record"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
