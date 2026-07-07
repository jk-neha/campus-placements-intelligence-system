import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Loader, EmptyState } from "../../components/States";
import { ChipList } from "../../components/Chips";

export default function CompanyEligibleStudents() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setStudents(await api.get("/company/eligible-students"));
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
        <h2>Eligible Students</h2>
        <span className="hint">Meeting your CGPA bar and every required skill</span>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {students.length === 0 ? (
        <EmptyState title="No matches yet" hint="Adjust your minimum CGPA or required skills in your company record." />
      ) : (
        <div className="card-row">
          {students.map((s) => (
            <div className="card" key={s.id} style={{ minWidth: 240 }}>
              <div className="record-title">{s.department}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>{s.name}</div>
              <div className="stat-caption">CGPA {s.cgpa} · Reg. {s.registration_number}</div>
              <hr className="divider" />
              <div className="record-title">Skills</div>
              <ChipList items={s.skills ? s.skills.split(",").map((x) => x.trim()).filter(Boolean) : []} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
