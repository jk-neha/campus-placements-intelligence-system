import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ErrorBanner } from "../components/States";
import logo from "./logo.jpeg"

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) {
    navigate(`/${user.role}`, { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Could not sign in");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-aside">
        <div>
          <img 
  src={logo} 
  alt="Campus Placement Logo" 
  className="seal"
/>
          {/* <div className="seal">JK</div> */}
          <h2>Welcome back to the register.</h2>
          <p>Sign in to pick up your applications, postings, or records exactly where you left them.</p>
        </div>
        <blockquote className="auth-quote">
          "A placement office runs on records, not guesswork."
        </blockquote>
      </div>

      <div className="auth-main">
        <div className="auth-box">
          <div className="brand">
            Registrar<span className="brand-mark">.</span>
          </div>
          <h2 style={{ fontSize: 22, marginBottom: 4 }}>Sign in</h2>
          <p className="stat-caption" style={{ marginBottom: 20 }}>
            Use the email and password you registered with.
          </p>

          <ErrorBanner message={error} />

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                required
                autoFocus
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <button className="btn btn-primary btn-block" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="auth-switch">
            New here? <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
