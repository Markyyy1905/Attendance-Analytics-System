import { FilterPanel } from "../../../components/ui/FilterPanel";
import { useMemo, useState } from "react";
import { Search, UserRoundSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { FilterCheckboxGroup } from "../../../components/ui/FilterCheckboxGroup";
import { RiskLabel } from "../../../components/ui/AttendanceMark";
import { PageHeader } from "../../../components/ui/PageHeader";
import { NoStudentsState } from "../../../components/ui/NoStudentsState";
import { useAttendanceData } from "../../../app/providers/AttendanceDataProvider";
import { getStudentMetrics } from "../../../shared/lib/attendanceMetrics";
import { matchesCoverageFilter, matchesRateFilter, matchesReviewFilter, type CoverageFilter, type RateFilter, type ReviewFilter } from "../../../shared/lib/attendanceFilters";
import "./StudentsPage.css";

function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }

export function StudentsPage() {
  const { dataset, isLoading, dataError } = useAttendanceData();
  const [search, setSearch] = useState("");
  const [reviewFilters, setReviewFilters] = useState<ReviewFilter[]>([]);
  const [rateFilters, setRateFilters] = useState<RateFilter[]>([]);
  const [coverageFilters, setCoverageFilters] = useState<CoverageFilter[]>([]);
  const [sectionFilters, setSectionFilters] = useState<string[]>([]);
  const students = useMemo(() => dataset.students
    .map((student) => ({ student, metrics: getStudentMetrics(student) }))
    .filter(({ student, metrics }) => student.name.toLowerCase().includes(search.trim().toLowerCase())
      && (!reviewFilters.length || reviewFilters.some((filter) => matchesReviewFilter(metrics, filter)))
      && (!rateFilters.length || rateFilters.some((filter) => matchesRateFilter(metrics, filter)))
      && (!coverageFilters.length || coverageFilters.some((filter) => matchesCoverageFilter(metrics, filter)))
      && (!sectionFilters.length || sectionFilters.includes(student.section))), [coverageFilters, dataset, search, rateFilters, reviewFilters, sectionFilters]);
  const flaggedCount = dataset.students.filter((student) => getStudentMetrics(student).riskReasons.length > 0).length;
  const activeFilterCount = reviewFilters.length + rateFilters.length + coverageFilters.length + sectionFilters.length;
  const clearFilters = () => { setReviewFilters([]); setRateFilters([]); setCoverageFilters([]); setSectionFilters([]); };

  return (
    <main className="page-students">
      <PageHeader title="Students" description="Review individual attendance patterns and see which students may need support." />
      <div className="students-overview-strip"><div><strong>{dataset.students.length}</strong><span>students in this dataset</span></div><div><strong>{flaggedCount}</strong><span>flagged for review</span></div><div><strong>{dataset.dates.length}</strong><span>dates across sections</span></div></div>
      <section className="panel students-panel">
        <div className="students-toolbar">
          <div><h2>Class roster</h2><p>Attendance rate and status for each student.</p></div>
          <div className="students-filters">
            <label className="search-control"><Search size={16} /><span className="sr-only">Search students</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a student" /></label>
            <FilterPanel activeCount={activeFilterCount}>
              <FilterCheckboxGroup label="Review status" options={[{ value: "needs-review", label: "Needs review" }, { value: "on-track", label: "No active flags" }]} selected={reviewFilters} onChange={setReviewFilters} />
              <FilterCheckboxGroup label="Attendance rate" options={[{ value: "below-75", label: "Below 75%" }, { value: "75-89", label: "75% to 89%" }, { value: "90-100", label: "90% to 100%" }, { value: "no-rate", label: "No eligible rate" }]} selected={rateFilters} onChange={setRateFilters} />
              <FilterCheckboxGroup label="Record completeness" options={[{ value: "complete", label: "Complete records" }, { value: "missing", label: "Has unrecorded sessions" }]} selected={coverageFilters} onChange={setCoverageFilters} />
              {dataset.sections.length > 1 && <FilterCheckboxGroup label="Section" options={dataset.sections.map((section) => ({ value: section, label: section }))} selected={sectionFilters} onChange={setSectionFilters} />}
              <button className="button button-secondary" type="button" onClick={clearFilters} disabled={!activeFilterCount}>Clear filters</button>
            </FilterPanel>
          </div>
        </div>
        {isLoading ? <div className="empty-state"><strong>Loading the class roster</strong><span>Retrieving saved student attendance.</span></div> : dataError && !dataset.students.length ? <div className="empty-state" role="alert"><strong>Roster unavailable</strong><span>{dataError}</span></div> : students.length ? <div className="data-table-wrap"><table className="data-table student-roster"><thead><tr><th>Student</th><th>Attendance</th><th>Present</th><th>Absent</th><th>Late</th><th>Status</th><th /></tr></thead><tbody>
          {students.map(({ student, metrics }, index) => <tr key={student.id}><td><div className="student-name-cell"><span className={`student-avatar student-avatar-${index % 5}`}>{initials(student.name)}</span><span className="student-name-copy"><strong>{student.name}</strong><span>{student.program}  /  {student.section}</span></span></div></td><td className={metrics.absent >= 3 ? "rate-low" : "roster-rate"}>{metrics.attendanceRate === null ? "—" : `${metrics.attendanceRate}%`}</td><td>{metrics.present}</td><td>{metrics.absent}</td><td>{metrics.late}</td><td><RiskLabel reasons={metrics.riskReasons} /></td><td><Link className="table-link" to={`/students/${student.id}`}>View profile</Link></td></tr>)}
        </tbody></table></div> : dataset.students.length ? <div className="empty-state"><UserRoundSearch size={23} /><strong>No students match these filters</strong><span>Try another name or review-status filter.</span></div> : <NoStudentsState />}
      </section>
      <div className="students-threshold-note">A student needs review after three or more absences.</div>
    </main>
  );
}
