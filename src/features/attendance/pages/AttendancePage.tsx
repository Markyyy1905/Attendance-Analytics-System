import { FilterPanel } from "../../../components/ui/FilterPanel";
import { useMemo, useState } from "react";
import { FileUp, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterCheckboxGroup } from "../../../components/ui/FilterCheckboxGroup";
import { AttendanceMark, RiskLabel } from "../../../components/ui/AttendanceMark";
import { PageHeader } from "../../../components/ui/PageHeader";
import { NoStudentsState } from "../../../components/ui/NoStudentsState";
import { useAttendanceData } from "../../../app/providers/AttendanceDataProvider";
import { getStatusForDate, getStudentMetrics } from "../../../shared/lib/attendanceMetrics";
import { filterDatesByPeriods, matchesCoverageFilter, matchesReviewFilter, type CoverageFilter, type PeriodSelection, type ReviewFilter } from "../../../shared/lib/attendanceFilters";
import "./AttendancePage.css";

function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }
function formatDate(date: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }

export function AttendancePage() {
  const { dataset, isLoading, dataError } = useAttendanceData();
  const [search, setSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState<ReviewFilter[]>([]);
  const [coverageFilters, setCoverageFilters] = useState<CoverageFilter[]>([]);
  const [periodFilters, setPeriodFilters] = useState<PeriodSelection[]>([]);
  const [sectionFilters, setSectionFilters] = useState<string[]>([]);
  const visibleDates = useMemo(() => {
    const sections = new Set(sectionFilters);
    const dates = sectionFilters.length
      ? [...new Set(dataset.students.filter((student) => sections.has(student.section)).flatMap((student) => student.sessions.map((session) => session.date)))].sort()
      : dataset.dates;
    return filterDatesByPeriods(dates, periodFilters);
  }, [dataset, periodFilters, sectionFilters]);
  const visibleDateSet = useMemo(() => new Set(visibleDates), [visibleDates]);
  const students = useMemo(() => dataset.students.flatMap((student) => {
    if (sectionFilters.length && !sectionFilters.includes(student.section)) return [];
    const scopedStudent = { ...student, sessions: student.sessions.filter((session) => visibleDateSet.has(session.date)) };
    const metrics = getStudentMetrics(scopedStudent);
    const matchesName = student.name.toLowerCase().includes(search.trim().toLowerCase());
    return matchesName
      && (!statusFilters.length || statusFilters.some((filter) => matchesReviewFilter(metrics, filter)))
      && (!coverageFilters.length || coverageFilters.some((filter) => matchesCoverageFilter(metrics, filter)))
      ? [{ student, metrics }] : [];
  }), [coverageFilters, dataset.students, search, sectionFilters, statusFilters, visibleDateSet]);
  const activeFilterCount = statusFilters.length + coverageFilters.length + periodFilters.length + sectionFilters.length;
  const clearFilters = () => { setStatusFilters([]); setCoverageFilters([]); setPeriodFilters([]); setSectionFilters([]); };

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
          <FilterPanel activeCount={activeFilterCount}>
            <FilterCheckboxGroup label="Reporting period" options={[{ value: "last-30-days", label: "Last 30 days" }, { value: "recent-10", label: "Latest 10 sessions" }, { value: "recent-5", label: "Latest 5 sessions" }]} selected={periodFilters} onChange={setPeriodFilters} />
            <FilterCheckboxGroup label="Review status" options={[{ value: "needs-review", label: "Needs review" }, { value: "on-track", label: "No active flags" }]} selected={statusFilters} onChange={setStatusFilters} />
            <FilterCheckboxGroup label="Record completeness" options={[{ value: "complete", label: "Complete records" }, { value: "missing", label: "Has unrecorded sessions" }]} selected={coverageFilters} onChange={setCoverageFilters} />
            {dataset.sections.length > 1 && <FilterCheckboxGroup label="Section" options={dataset.sections.map((section) => ({ value: section, label: section }))} selected={sectionFilters} onChange={setSectionFilters} />}
            <button className="button button-secondary" type="button" onClick={clearFilters} disabled={!activeFilterCount}>Clear filters</button>
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
