import { FilterPanel } from "../../../components/ui/FilterPanel";
import { useMemo, useState } from "react";
import { FileUp, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { AttendanceMark, RiskLabel } from "../../../components/ui/AttendanceMark";
import { PageHeader } from "../../../components/ui/PageHeader";
import { NoStudentsState } from "../../../components/ui/NoStudentsState";
import { AttendanceCoverageFilter, AttendancePeriodFilter, AttendanceSectionFilter, AttendanceStatusFilter } from "../components/AttendanceFilters";
import { useAttendanceData } from "../../../app/providers/AttendanceDataProvider";
import { getStatusForDate, getStudentMetrics } from "../../../shared/lib/attendanceMetrics";
import { filterDatesByPeriod, matchesCoverageFilter, matchesReviewFilter, type CoverageFilter, type PeriodFilter, type ReviewFilter } from "../../../shared/lib/attendanceFilters";
import "./AttendancePage.css";

function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }
function formatDate(date: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }

export function AttendancePage() {
  const { dataset, isLoading, dataError } = useAttendanceData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewFilter>("all");
  const [coverageFilter, setCoverageFilter] = useState<CoverageFilter>("all");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const visibleDates = useMemo(() => filterDatesByPeriod(sectionFilter === "all"
    ? dataset.dates
    : [...new Set(dataset.students.filter((student) => student.section === sectionFilter).flatMap((student) => student.sessions.map((session) => session.date)))].sort(), periodFilter), [dataset, periodFilter, sectionFilter]);
  const visibleDateSet = useMemo(() => new Set(visibleDates), [visibleDates]);
  const students = useMemo(() => dataset.students.flatMap((student) => {
    if (sectionFilter !== "all" && student.section !== sectionFilter) return [];
    const scopedStudent = { ...student, sessions: student.sessions.filter((session) => visibleDateSet.has(session.date)) };
    const metrics = getStudentMetrics(scopedStudent);
    const matchesName = student.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchesName && matchesReviewFilter(metrics, statusFilter) && matchesCoverageFilter(metrics, coverageFilter) ? [{ student, metrics }] : [];
  }), [coverageFilter, dataset.students, search, sectionFilter, statusFilter, visibleDateSet]);

  return (
    <main className="page-attendance">
      <PageHeader title="Attendance records" description="Review each student attendance by class date, all in one place." actions={<Link className="button button-primary" to="/import"><FileUp size={16} /> Import a file</Link>} />

      <div className="attendance-summary-line">
        <div><strong>{dataset.metadata.subjectTitle || "Class attendance"}</strong><span>{[dataset.metadata.subjectCode, dataset.metadata.program, dataset.sections.join(", ")].filter(Boolean).join("  /  ")}</span></div>
        <span className="records-count">{students.length} of {dataset.students.length} students / {visibleDates.length} sessions</span>
      </div>

      <section className="panel attendance-table-panel">
        <div className="attendance-controls">
          <label className="search-control"><Search size={16} /><span className="sr-only">Search students</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students" /></label>
          <FilterPanel><AttendancePeriodFilter value={periodFilter} onChange={setPeriodFilter} />
          <AttendanceStatusFilter value={statusFilter} onChange={setStatusFilter} />
          <AttendanceCoverageFilter value={coverageFilter} onChange={setCoverageFilter} />
          {dataset.sections.length > 1 && <AttendanceSectionFilter sections={dataset.sections} value={sectionFilter} onChange={setSectionFilter} />}
          </FilterPanel><span className="mark-legend"><span><AttendanceMark status="P" /> Present</span><span><AttendanceMark status="A" /> Absent</span><span><AttendanceMark status="L" /> Late</span></span>
        </div>
        {isLoading ? <div className="empty-state attendance-empty"><strong>Loading attendance</strong><span>Retrieving class sessions and marks.</span></div> : dataError && !dataset.students.length ? <div className="empty-state attendance-empty" role="alert"><strong>Attendance unavailable</strong><span>{dataError}</span></div> : students.length ? <div className="data-table-wrap attendance-matrix-wrap">
          <table className="data-table attendance-matrix">
            <thead><tr><th className="student-col">Student</th>{visibleDates.map((date) => <th key={date} className="date-col">{formatDate(date)}</th>)}<th>Rate</th><th>Present</th><th>Absent</th><th>Late</th><th>Review</th></tr></thead>
            <tbody>{students.map(({ student, metrics }) => {
              return <tr key={student.id}>
                <td className="student-col"><div className="student-name-cell"><span className="student-avatar">{initials(student.name)}</span><span className="student-name-copy"><strong>{student.name}</strong><span>{student.program}  /  {student.section}</span></span></div></td>
                {visibleDates.map((date) => <td key={`${student.id}-${date}`} className="mark-cell"><AttendanceMark status={getStatusForDate(student, date)} /></td>)}
                <td className={metrics.absent >= 3 ? "rate-low" : "rate-normal"}>{metrics.attendanceRate === null ? "—" : `${metrics.attendanceRate}%`}</td><td>{metrics.present}</td><td>{metrics.absent}</td><td>{metrics.late}</td><td><RiskLabel reasons={metrics.riskReasons} /></td>
              </tr>;
            })}</tbody>
          </table>
        </div> : dataset.students.length ? <div className="empty-state attendance-empty"><div className="empty-state-mark">-</div><strong>No students match these filters</strong><span>Try a different name or attendance filter.</span></div> : <NoStudentsState />}
        <div className="attendance-table-footer"><span>Rate = (present + late)  /  (present + late + absent). Excused and blank records are excluded.</span><span>{visibleDates.length} dates shown</span></div>
      </section>
      <div className="attendance-source-hint">Source: <strong>{dataset.sourceName}</strong>. Status marks are shown as recorded in the file.</div>
    </main>
  );
}
