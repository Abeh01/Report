import { useState, useEffect } from "react";
import "./report.css";
import defaultImg from "./assets/default.jpg";

function Report() {
  const [reports, setReports] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); 
  const [buildingFilter, setBuildingFilter] = useState("All Buildings");
  const [concernFilter, setConcernFilter] = useState("All Concerns");
  const [showDuplicates, setShowDuplicates] = useState(false); // ✅ toggle state

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.clear();
    window.location.href = "/index.html"; 
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/reports");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const getDuplicateCounts = (reports) => {
    const counts = {};
    reports.forEach((report) => {
      const key = `${report.building}-${report.concern}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  };

  const duplicateCounts = getDuplicateCounts(reports);

  const filterUniqueReports = (reports) => {
    const seen = new Set();
    return reports.filter((report) => {
      const key = `${report.building}-${report.concern}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  // ✅ Use toggle: show all or unique only
  const reportsToDisplay = showDuplicates ? reports : filterUniqueReports(reports);

  const getReportsByGroup = (groupKey) =>
    reports.filter((r) => `${r.building}-${r.concern}` === groupKey);

  const buildingOptions = ["All Buildings", ...new Set(reports.map(r => r.building))];
  const concernOptions = ["All Concerns", ...new Set(reports.map(r => r.concern))];

  const filteredReports = reportsToDisplay.filter(report => {
    const buildingMatch = buildingFilter === "All Buildings" || report.building === buildingFilter;
    const concernMatch = concernFilter === "All Concerns" || report.concern === concernFilter;
    return buildingMatch && concernMatch;
  });

  return (
    <div className="report-wrapper">
      {/* 🔹 Header with Logout */}
      <div className="header">
        <h1>REPORTS</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* 🔹 Filters */}
      <div className="filters">
        <select value={buildingFilter} onChange={(e) => setBuildingFilter(e.target.value)}>
          {buildingOptions.map((b, idx) => (
            <option key={idx} value={b}>{b}</option>
          ))}
        </select>

        <select value={concernFilter} onChange={(e) => setConcernFilter(e.target.value)}>
          {concernOptions.map((c, idx) => (
            <option key={idx} value={c}>{c}</option>
          ))}
        </select>

        {/* ✅ Checkbox to toggle duplicates */}
        <label className="duplicate-toggle">
          <input
            type="checkbox"
            checked={showDuplicates}
            onChange={() => setShowDuplicates(!showDuplicates)}
          />
          Show Duplicates
        </label>
      </div>

      {/* 🔹 Report List */}
      {selectedGroup ? (
        <div className="reports-list">
          <h2>
            Similar Reports for <em>{selectedGroup}</em>
          </h2>
          <button onClick={() => setSelectedGroup(null)} className="back-btn">
            ⬅ Back
          </button>

          {getReportsByGroup(selectedGroup).map((report) => (
            <div key={report._id} className="report">
              <div className="report-img-container">
                <img
                  src={report.image ? `http://localhost:3000${report.image}` : defaultImg}
                  alt="Report"
                  className="report-img"
                  onError={(e) => (e.target.src = defaultImg)}
                />
              </div>
              <div className="report-body">
                <h3>{report.heading || "Untitled Report"}</h3>
                <p>{report.description || "No description provided."}</p>
                <div className="report-info">
                  <p><strong>Building:</strong> {report.building}</p>
                  <p><strong>Concern:</strong> {report.concern}</p>
                  <p className="status"><strong>Status:</strong> {report.status || "Pending"}</p>
                </div>
                <p className="submitted-date">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="reports-list">
          {filteredReports.map((report) => {
            const key = `${report.building}-${report.concern}`;
            const duplicates = (duplicateCounts[key] || 1) - 1;

            return (
              <div key={report._id} className="report">
                <div className="report-img-container">
                  <img
                    src={report.image ? `http://localhost:3000${report.image}` : defaultImg}
                    alt="Report"
                    className="report-img"
                    onError={(e) => (e.target.src = defaultImg)}
                  />
                </div>
                <div className="report-body">
                  <h3>{report.heading || "Untitled Report"}</h3>
                  <p>{report.description || "No description provided."}</p>
                  <div className="report-info">
                    <p><strong>Building:</strong> {report.building}</p>
                    <p><strong>Concern:</strong> {report.concern}</p>
                    <p className="status"><strong>Status:</strong> {report.status || "Pending"}</p>
                  </div>
                  <p className="submitted-date">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>

                  {!showDuplicates && duplicates > 0 && (
                    <p
                      className="duplicate-msg"
                      onClick={() => setSelectedGroup(key)}
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      Similar type of Report: ({duplicates}{" "}
                      {duplicates === 1 ? "report" : "reports"})
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Report;
