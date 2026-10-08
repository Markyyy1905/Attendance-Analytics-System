import { useMemo, useState } from "react";
import { Search, UserRoundSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { RiskLabel } from "../../../components/ui/AttendanceMark";
import { PageHeader } from "../../../components/ui/PageHeader";
import { NoStudentsState } from "../../../components/ui/NoStudentsState";
import { StudentCoverageFilter, StudentRateFilter, StudentSectionFilter, StudentStatusFilter } from "../components/StudentFilters";
import { useAttendanceData } from "../../../app/providers/AttendanceDataProvider";
import { getStudentMetrics } from "../../../shared/lib/attendanceMetrics";
import { matchesCoverageFilter, matchesRateFilter, matchesReviewFilter, type CoverageFilter, type RateFilter, type ReviewFilter } from "../../../shared/lib/attendanceFilters";
import "./StudentsPage.css";

function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }

export function StudentsPage() {
  const { dataset, isLoading, dataError } = useAttendanceData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [rateFilter, setRateFilter] = useState<RateFilter>("all");
  const [coverageFilter, setCoverageFilter] = useState<CoverageFilter>("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const students = useMemo(() => dataset.students
    .map((student) => ({ student, metrics: getStudentMetrics(student) }))
    .filter(({ student, metrics }) => student.name.toLowerCase().includes(search.trim().toLowerCase()) && matchesReviewFilter(metrics, filter) && matchesRateFilter(metrics, rateFilter) && matchesCoverageFilter(metrics, coverageFilter) && (sectionFilter === "all" || student.section === sectionFilter)), [coverageFilter, dataset, search, filter, rateFilter, sectionFilter]);
  const flaggedCount = dataset.students.filter((student) => getStudentMetrics(student).riskReasons.length > 0).length;

  return (
    <main className="page-students">
      <PageHeader title="Students" description="Review individual attendance patterns and see which students may need support." />
      <div className="students-overview-strip"><div><strong>{dataset.students.length}</strong><span>students in this dataset</span></div><div><strong>{flaggedCount}</strong><span>flagged for review</span></div><div><strong>{dataset.dates.length}</strong><span>dates across sections</span></div></div>
      <section className="panel students-panel">
        <div className="students-toolbar">
          <div><h2>Class roster</h2><p>Attendance rate and status for each student.</p></div>
          <div className="students-filters">
            <label className="search-control"><Search size={16} /><span className="sr-only">Search students</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a student" /></label>
            <StudentStatusFilter value={filter} onChange={setFilter} />
            <StudentRateFilter value={rateFilter} onChange={setRateFilter} />
            <StudentCoverageFilter value={coverageFilter} onChange={setCoverageFilter} />
            {dataset.sections.length > 1 && <StudentSectionFilter sections={dataset.sections} value={sectionFilter} onChange={setSectionFilter} />}
          </div>
        </div>
        {isLoading ? <div className="empty-state"><strong>Loading the class roster</strong><span>Retrieving saved student attendance.</span></div> : dataError && !dataset.students.length ? <div className="empty-state" role="alert"><strong>Roster unavailable</strong><span>{dataError}</span></div> : students.length ? <div className="data-table-wrap"><table className="data-table student-roster"><thead><tr><th>Student</th><th>Attendance</th><th>Present</th><th>Absent</th><th>Late</th><th>Status</th><th /></tr></thead><tbody>
          {students.map(({ student, metrics }, index) => <tr key={student.id}><td><div className="student-name-cell"><span className={`student-avatar student-avatar-${index % 5}`}>{initials(student.name)}</span><span className="student-name-copy"><strong>{student.name}</strong><span>{student.program}  /  {student.section}</span></span></div></td><td className={metrics.attendanceRate !== null && metrics.attendanceRate < 75 ? "rate-low" : "roster-rate"}>{metrics.attendanceRate === null ? "—" : `${metrics.attendanceRate}%`}</td><td>{metrics.present}</td><td>{metrics.absent}</td><td>{metrics.late}</td><td><RiskLabel reasons={metrics.riskReasons} /></td><td><Link className="table-link" to={`/students/${student.id}`}>View profile</Link></td></tr>)}
        </tbody></table></div> : dataset.students.length ? <div className="empty-state"><UserRoundSearch size={23} /><strong>No students match these filters</strong><span>Try another name or review-status filter.</span></div> : <NoStudentsState />}
      </section>
      <div className="students-threshold-note">A student is flagged when attendance is below 75%, there are five consecutive absences, or total absences exceed eight.</div>
    </main>
  );
}

