import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ErrorBanner, SuccessBanner } from "../components/States";

const ROLES = [
  { value: "student", label: "Student" },
  { value: "company", label: "Company" },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ user_name: "", user_mail: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      await register({ ...form, role });
      setSuccess("Account created. Redirecting to sign in…");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message || "Could not create account");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-aside">
        <div>
          <div className="seal">R</div>
          <h2>One record, filled in once.</h2>
          <p>
            Register here first — you'll fill in your registration number, CGPA, and skills (or your
            company's requirements) as a second step, right after you sign in.
          </p>
        </div>
        <blockquote className="auth-quote">
          "Every application starts with an accurate record."
        </blockquote>
      </div>

      <div className="auth-main">
        <div className="auth-box">
          <div className="brand">
            Registrar<span className="brand-mark">.</span>
          </div>
          <h2 style={{ fontSize: 22, marginBottom: 4 }}>Create your account</h2>
          <p className="stat-caption" style={{ marginBottom: 20 }}>
            Choose how you'll use the register.
          </p>

          <div className="role-pick">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                className={role === r.value ? "active" : ""}
                onClick={() => setRole(r.value)}
              >
                {r.label}
              </button>
            ))}
          </div>

          <ErrorBanner message={error} />
          <SuccessBanner message={success} />

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="user_name">{role === "company" ? "Company name" : "Full name"}</label>
              <input
                id="user_name"
                className="input"
                required
                value={form.user_name}
                onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                placeholder={role === "company" ? "Nimbus Systems" : "Aditi Rao"}
              />
            </div>
            <div className="field">
              <label htmlFor="user_mail">Email</label>
              <input
                id="user_mail"
                className="input"
                type="email"
                required
                value={form.user_mail}
                onChange={(e) => setForm({ ...form, user_mail: e.target.value })}
                placeholder="you@campus.edu"
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters"
              />
            </div>
            <button className="btn btn-primary btn-block" disabled={busy}>
              {busy ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="auth-switch">
            Already registered? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
