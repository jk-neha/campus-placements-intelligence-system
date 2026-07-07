import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { Loader } from "../../components/States";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  const [studentUsers, setStudentUsers] = useState(0);
  const [companyUsers, setCompanyUsers] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [students, companies, sUsers, cUsers] = await Promise.all([
          api.get("/students"),
          api.get("/company"),
          api.get("/users/students"),
          api.get("/users/companies"),
        ]);
        setStudentCount(students.length);
        setCompanyCount(companies.length);
        setStudentUsers(sUsers.length);
        setCompanyUsers(cUsers.length);
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
      {error && <p className="error-banner">{error}</p>}

      <div className="card-row">
        <div className="card">
          <div className="record-title">Student records</div>
          <div className="stat-value">{studentCount}</div>
          <div className="stat-caption">{studentUsers} student user accounts</div>
        </div>
        <div className="card">
          <div className="record-title">Company records</div>
          <div className="stat-value">{companyCount}</div>
          <div className="stat-caption">{companyUsers} company user accounts</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="section-heading">
          <h2>Registrar actions</h2>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/create" className="btn btn-brass">
            Add a record
          </Link>
          <Link to="/admin/students" className="btn btn-ghost">
            Manage students
          </Link>
          <Link to="/admin/companies" className="btn btn-ghost">
            Manage companies
          </Link>
        </div>
      </div>
    </div>
  );
}
