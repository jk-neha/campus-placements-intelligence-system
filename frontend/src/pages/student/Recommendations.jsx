import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Loader, EmptyState } from "../../components/States";
import Gauge from "../../components/Gauge";
import { ChipList } from "../../components/Chips";

export default function StudentRecommendations() {
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const me = await api.get("/student/me");
        const data = await api.get(`/recommendations/${me.id}`);
        setRecs(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="section-heading">
        <h2>Recommendations</h2>
        <span className="hint">Ranked by readiness score, highest first</span>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {recs.length === 0 ? (
        <EmptyState title="No companies to compare yet" />
      ) : (
        recs.map((r, i) => (
          <div className="card" key={r.company + i}>
            <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
              <Gauge score={r.readiness_score} size={72} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>
                    {r.company}
                  </div>
                  <span className={`badge ${r.eligible ? "badge-moss" : "badge-rust"}`}>
                    {r.eligible ? "Eligible" : "Not yet eligible"}
                  </span>
                </div>
                <div style={{ marginTop: 10 }}>
                  <div className="record-title">Missing skills</div>
                  <ChipList items={r.missing_skills} missing empty="None — you meet every listed skill." />
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
