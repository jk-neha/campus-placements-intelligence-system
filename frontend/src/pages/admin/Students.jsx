import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Loader, EmptyState } from "../../components/States";

export default function AdminStudents() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setStudents(await api.get("/students"));
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
        <span className="hint">
          {students.length} record{students.length === 1 ? "" : "s"}
        </span>
      </div>


      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}


      {students.length === 0 ? (
        <EmptyState title="No student records yet" />
      ) : (

        students.map((s) => (

          <div className="job-card" key={s.id}>

            <div>

              <div className="job-title">
                {s.name}
              </div>


              <div className="job-meta">

                <span>
                  Reg. {s.registration_number}
                </span>

                <span>
                  {s.department}
                </span>

                <span>
                  CGPA {s.cgpa}
                </span>

              </div>


              <div className="job-desc">
                {s.skills || "No skills listed"}
              </div>


            </div>


            <div>

              <button
                className="btn btn-danger btn-sm"
                disabled={busyId === s.id}
                onClick={() => remove(s.id)}
              >

                {busyId === s.id ? "Deleting..." : "Delete"}

              </button>

            </div>


          </div>

        ))

      )}

    </div>
  );
}