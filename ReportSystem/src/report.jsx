import { useState, useEffect } from "react";
import "./report.css";
import defaultImg from "./assets/default.jpg";

function Report() {
  const [reports, setReports] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [buildingFilter, setBuildingFilter] = useState("All Buildings");
  const [concernFilter, setConcernFilter] = useState("All Concerns");
  const [showDuplicates, setShowDuplicates] = useState(false);

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

  const getDuplicateCounts = (items) => {
    const counts = {};
    items.forEach((r) => {
      const key = `${r.building}-${r.concern}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  };

  const duplicateCounts = getDuplicateCounts(reports);

  const filterUniqueReports = (items) => {
    const seen = new Set();
    return items.filter((r) => {
      const key = `${r.building}-${r.concern}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  // Toggle handler: also exit any open group view to keep UI consistent
  const toggleShowDuplicates = () => {
    setSelectedGroup(null);
    setShowDuplicates((v) => !v);
  };

  const reportsToDisplay = showDuplicates ? reports : filterUniqueReports(reports);

  const getReportsByGroup = (groupKey) =>
    reports.filter((r) => `${r.building}-${r.concern}` === groupKey);

  const buildingOptions = ["All Buildings", ...new Set(reports.map((r) => r.building))];
  const concernOptions = ["All Concerns", ...new Set(reports.map((r) => r.concern))];

  const filteredReports = reportsToDisplay.filter((report) => {
    const buildingMatch = buildingFilter === "All Buildings" || report.building === buildingFilter;
    const concernMatch = concernFilter === "All Concerns" || report.concern === concernFilter;
    return buildingMatch && concernMatch;
  });

  // Optional: keep same-group items adjacent when showing duplicates
  const sortedReports = [...filteredReports].sort((a, b) => {
    const ka = `${a.building}-${a.concern}`;
    const kb = `${b.building}-${b.concern}`;
    return ka.localeCompare(kb);
  });

  return (
    <div className="report-wrapper">
      {/* Header */}
      <div className="header">
        <h1>REPORTS</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Filters */}
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

        <label className="duplicate-toggle">
          <input
            type="checkbox"
            checked={showDuplicates}
            onChange={toggleShowDuplicates}
          />
          Show Duplicates
        </label>
      </div>

      {/* List / Group view */}
      {selectedGroup ? (
        <div className="reports-list">
          <div className="group-header full-row">
            <h2>Similar Reports for <em>{selectedGroup}</em></h2>
            <button onClick={() => setSelectedGroup(null)} className="back-btn">Back</button>
          </div>

          {getReportsByGroup(selectedGroup).map((report) => (
            <div key={report._id} className="report">
              <div className="report-img-container">
                <img
                  src={report.image ? `http://localhost:3000${report.image}` : defaultImg}
                  alt="Report"
                  className="report-img"
                  onError={(e) => (e.currentTarget.src = defaultImg)}
                />
              </div>
              <div className="report-body">
                <h3>{report.heading || "Untitled Report"}</h3>
                <p>{report.description || "No description provided."}</p>
                <div className="report-info">
                  <p><strong>Building:</strong> {report.building}</p>
                  <p><strong>Concern:</strong> {report.concern}</p>
                  <p className={`status ${String((report.status || 'Pending')).toLowerCase().replace(/\s+/g, '-')}`}>
                    <strong>Status:</strong> {report.status || "Pending"}
                  </p>
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
          {sortedReports.map((report) => {
            const key = `${report.building}-${report.concern}`;
            const groupCount = duplicateCounts[key] || 1; // total in that group
            const duplicates = groupCount - 1;

            return (
              <div key={report._id} className="report">
                <div className="report-img-container">
                  {/* Show a badge when we’re displaying duplicates so grouping is clear */}
                  {showDuplicates && groupCount > 1 && (
                    <span className="dup-badge">{groupCount} in group</span>
                  )}
                  <img
                    src={report.image ? `http://localhost:3000${report.image}` : defaultImg}
                    alt="Report"
                    className="report-img"
                    onError={(e) => (e.currentTarget.src = defaultImg)}
                  />
                </div>
                <div className="report-body">
                  <h3>{report.heading || "Untitled Report"}</h3>
                  <p>{report.description || "No description provided."}</p>
                  <div className="report-info">
                    <p><strong>Building:</strong> {report.building}</p>
                    <p><strong>Concern:</strong> {report.concern}</p>
                    <p className={`status ${String((report.status || 'Pending')).toLowerCase().replace(/\s+/g, '-')}`}>
                      <strong>Status:</strong> {report.status || "Pending"}
                    </p>
                  </div>
                  <p className="submitted-date">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>

                  {/* Only show “similar reports” link when NOT showing duplicates */}
                  {!showDuplicates && duplicates > 0 && (
                    <button
                      type="button"
                      className="duplicate-msg"
                      onClick={() => setSelectedGroup(key)}
                    >
                      View {duplicates} similar {duplicates === 1 ? "report" : "reports"}
                    </button>
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
