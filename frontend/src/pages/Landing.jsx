import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="brand" style={{ color: "var(--ink)" }}>
          Registrar<span className="brand-mark">.</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/login" className="btn btn-ghost btn-sm">
            Sign in
          </Link>
        </div>
      </nav>

      <div className="landing-hero">
        <div>
          <h1>The placement office, kept in one open ledger.</h1>
          <p className="lede">
            Students track eligibility and applications. Recruiters manage openings and candidates.
Admins control the complete placement workflow through one centralized system.
          </p>
          <div className="landing-cta">
  <Link to="/login" className="btn btn-brass">
    Access Placement Portal
  </Link>

  <Link to="/login" className="btn btn-ghost">
    Sign in
  </Link>
</div>

          <div className="stat-strip">
            <div>
              <div className="num">3</div>
              <div className="lbl">roles in one platform</div>
            </div>
            <div>
              <div className="num">100%</div>
              <div className="lbl">skill-matched readiness scoring</div>
            </div>
            <div>
              <div className="num">1</div>
              <div className="lbl">place to track every application</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <div className="record-title">Sample record — readiness dial</div>
          <div style={{ display: "flex", gap: 22, marginTop: 14, flexWrap: "wrap" }}>
            <ReadinessPreview score={82} name="Aditi R." company="Nimbus Systems" />
            <ReadinessPreview score={54} name="Rohan K." company="Cobalt Retail" />
          </div>
          <hr className="divider" />
          <p className="stat-caption">
            Every score here comes straight from a CGPA and skill-match check against a company's
            real requirements — the same dial appears on the student, recruiter, and admin views.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReadinessPreview({ score, name, company }) {
  const color = score <= 40 ? "var(--rust)" : score <= 70 ? "var(--brass)" : "var(--moss)";
  return (
    <div style={{ flex: 1, minWidth: 140 }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="30" fill="none" stroke="var(--slate-line)" strokeWidth="8" />
        <circle
          cx="36"
          cy="36"
          r="30"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={2 * Math.PI * 30}
          strokeDashoffset={2 * Math.PI * 30 * (1 - score / 100)}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
        />
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="16" fontWeight="600">
          {score}
        </text>
      </svg>
      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>{name}</div>
      <div className="stat-caption">→ {company}</div>
    </div>
  );
}
