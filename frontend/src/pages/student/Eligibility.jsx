import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Loader } from "../../components/States";
import Gauge from "../../components/Gauge";
import { ChipList } from "../../components/Chips";

export default function StudentEligibility() {
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [me, companyList] = await Promise.all([api.get("/student/me"), api.get("/company")]);
        setStudentId(me.id);
        setCompanies(companyList);
        if (companyList.length) setCompanyId(String(companyList[0].id));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const runCheck = async () => {
    if (!companyId || !studentId) return;
    setChecking(true);
    setError("");
    setResult(null);
    try {
      const data = await api.get(`/eligibility/${studentId}/${companyId}`);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setChecking(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="section-heading">
        <h2>Eligibility Check</h2>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <div className="field" style={{ maxWidth: 360 }}>
          <label htmlFor="company-select">Choose a company</label>
          <select
            id="company-select"
            className="input"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company_name}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={runCheck} disabled={checking || !companyId}>
          {checking ? "Checking…" : "Run eligibility check"}
        </button>
      </div>

      {result && (
        <div className="card" style={{ marginTop: 18 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <Gauge score={result.readiness_score} size={96} />
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h3 style={{ fontSize: 18 }}>{result.company}</h3>
                <span className={`badge ${result.eligible ? "badge-moss" : "badge-rust"}`}>
                  {result.eligible ? "Eligible" : "Not eligible"}
                </span>
              </div>
              <div className="card-row" style={{ marginTop: 10 }}>
                <div>
                  <div className="record-title">Your CGPA</div>
                  <div className="stat-value" style={{ fontSize: 22 }}>{result.student_cgpa}</div>
                </div>
                <div>
                  <div className="record-title">Required CGPA</div>
                  <div className="stat-value" style={{ fontSize: 22 }}>{result.company_required_cgpa}</div>
                </div>
              </div>
            </div>
          </div>
          <hr className="divider" />
          <div className="record-title">Missing skills</div>
          <ChipList items={result.missing_skills} missing empty="None — every required skill is on your record." />
        </div>
      )}
    </div>
  );
}
