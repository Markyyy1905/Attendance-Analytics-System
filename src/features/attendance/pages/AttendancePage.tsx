import { useMemo, useState } from "react";
import { FileUp, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { AttendanceMark, RiskLabel } from "../../../components/ui/AttendanceMark";
import { PageHeader } from "../../../components/ui/PageHeader";
import { useAttendanceData } from "../../../app/providers/AttendanceDataProvider";
import { getStatusForDate, getStudentMetrics } from "../../../shared/lib/attendanceMetrics";
import "./AttendancePage.css";

function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }
function formatDate(date: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }

export function AttendancePage() {
  const { dataset } = useAttendanceData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const students = useMemo(() => dataset.students.filter((student) => {
    const matchesName = student.name.toLowerCase().includes(search.toLowerCase());
    const metrics = getStudentMetrics(student);
    const matchesStatus = statusFilter === "all" || (statusFilter === "risk" ? metrics.riskReasons.length > 0 : metrics.riskReasons.length === 0);
    return matchesName && matchesStatus && (sectionFilter === "all" || student.section === sectionFilter);
  }), [dataset, search, statusFilter, sectionFilter]);
  const visibleDates = useMemo(() => sectionFilter === "all"
    ? dataset.dates
    : [...new Set(dataset.students.filter((student) => student.section === sectionFilter).flatMap((student) => student.sessions.map((session) => session.date)))].sort(), [dataset, sectionFilter]);

  return (
    <main className="page-attendance">
      <PageHeader title="Attendance records" description="Review each student’s attendance by class date, all in one place." actions={<Link className="button button-primary" to="/import"><FileUp size={16} /> Import a file</Link>} />

      <div className="attendance-summary-line">
        <div><strong>{dataset.metadata.subjectTitle || "Class attendance"}</strong><span>{[dataset.metadata.subjectCode, dataset.metadata.program, dataset.sections.join(", ")].filter(Boolean).join(" · ")}</span></div>
        <span className="records-count">{students.length} of {dataset.students.length} students</span>
      </div>

      <section className="panel attendance-table-panel">
        <div className="attendance-controls">
          <label className="search-control"><Search size={16} /><span className="sr-only">Search students</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students" /></label>
          <label className="select-control attendance-filter"><SlidersHorizontal size={15} /><span className="sr-only">Filter students</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All students</option><option value="risk">Needs a check-in</option><option value="clear">On track</option></select></label>
          {dataset.sections.length > 1 && <label className="select-control attendance-filter"><span className="sr-only">Filter by section</span><select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)}><option value="all">All sections</option>{dataset.sections.map((section) => <option key={section} value={section}>{section}</option>)}</select></label>}
          <span className="mark-legend"><span><AttendanceMark status="P" /> Present</span><span><AttendanceMark status="A" /> Absent</span><span><AttendanceMark status="L" /> Late</span></span>
        </div>
        {students.length ? <div className="data-table-wrap attendance-matrix-wrap">
          <table className="data-table attendance-matrix">
            <thead><tr><th className="student-col">Student</th>{visibleDates.map((date) => <th key={date} className="date-col">{formatDate(date)}</th>)}<th>Rate</th><th>Present</th><th>Absent</th><th>Late</th><th>Review</th></tr></thead>
            <tbody>{students.map((student) => {
              const metrics = getStudentMetrics(student);
              return <tr key={student.id}>
                <td className="student-col"><div className="student-name-cell"><span className="student-avatar">{initials(student.name)}</span><span className="student-name-copy"><strong>{student.name}</strong><span>{student.program} · {student.section}</span></span></div></td>
                {visibleDates.map((date) => <td key={`${student.id}-${date}`} className="mark-cell"><AttendanceMark status={getStatusForDate(student, date)} /></td>)}
                <td className={metrics.attendanceRate < 75 ? "rate-low" : "rate-normal"}>{metrics.attendanceRate}%</td><td>{metrics.present}</td><td>{metrics.absent}</td><td>{metrics.late}</td><td><RiskLabel reasons={metrics.riskReasons} /></td>
              </tr>;
            })}</tbody>
          </table>
        </div> : <div className="empty-state attendance-empty"><div className="empty-state-mark">—</div><strong>No students match these filters</strong><span>Try a different name or attendance filter.</span></div>}
        <div className="attendance-table-footer"><span>Rate uses the demo formula: present marks ÷ recorded marks. Blank cells have no mark.</span><span>{visibleDates.length} dates shown</span></div>
      </section>
      <div className="attendance-source-hint">Source: <strong>{dataset.sourceName}</strong>. Status marks are shown as recorded in the file.</div>
    </main>
  );
}
