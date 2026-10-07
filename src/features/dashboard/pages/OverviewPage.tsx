import { useMemo, useState } from "react";
import { ArrowDownToLine, ArrowRight, BookOpen, CalendarDays, CheckCircle2, CircleAlert, FileUp, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { AttendanceTrendChart } from "../../../components/charts/AttendanceTrendChart";
import { AttendanceMark, RiskLabel } from "../../../components/ui/AttendanceMark";
import { EmptyState, PageHeader, SectionTitle } from "../../../components/ui/PageHeader";
import { TrendRangeSelect } from "../components/TrendRangeSelect";
import { NoStudentsState } from "../../../components/ui/NoStudentsState";
import { useAttendanceData } from "../../../app/providers/AttendanceDataProvider";
import { getDateTrend, getDatasetSummary, getStudentMetrics } from "../../../shared/lib/attendanceMetrics";
import "./OverviewPage.css";

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function OverviewPage() {
  const { dataset, isLoading, dataError } = useAttendanceData();
  const [range, setRange] = useState("all");
  const summary = getDatasetSummary(dataset);
  const trend = useMemo(() => {
    const allDates = getDateTrend(dataset);
    return range === "recent" ? allDates.slice(-5) : allDates;
  }, [dataset, range]);
  const studentsAtRisk = dataset.students
    .map((student) => ({ student, metrics: getStudentMetrics(student) }))
    .filter(({ metrics }) => metrics.riskReasons.length > 0)
    .sort((a, b) => (a.metrics.attendanceRateExact ?? 101) - (b.metrics.attendanceRateExact ?? 101));

  const latestDate = dataset.dates.at(-1);
  const formattedLatestDate = latestDate
    ? new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${latestDate}T00:00:00Z`))
    : "No dates recorded";

  if (!dataset.students.length) {
    return <main className="page-overview">
      <PageHeader title="Attendance overview" description="Attendance summaries appear after records are saved to PostgreSQL." />
      <section className="panel">
        {isLoading ? <EmptyState title="Loading attendance data" description="Connecting to PostgreSQL." /> : dataError ? <EmptyState title="Database connection unavailable" description={dataError} /> : <NoStudentsState />}
      </section>
    </main>;
  }

  return (
    <main className="page-overview">
      <PageHeader
        title="Attendance overview"
        description="A clear view of your classes, student attendance, and who may need a check-in."
        actions={<Link className="button button-primary" to="/import"><FileUp size={16} /> Upload attendance</Link>}
      />

      <div className="overview-context">
        <div className="context-course-icon"><BookOpen size={18} /></div>
        <div className="context-course-copy">
          <strong>{dataset.metadata.subjectTitle || "Attendance dataset"}</strong>
          <span>{[dataset.metadata.subjectCode, dataset.metadata.program, dataset.sections.join(", ")].filter(Boolean).join(" · ") || "Class details available after import"}</span>
        </div>
        <div className="context-divider" />
        <div className="context-detail"><span>Term</span><strong>{dataset.metadata.term || "Not provided"}</strong></div>
        <div className="context-divider context-divider-wide" />
        <div className="context-detail"><span>Latest session</span><strong>{formattedLatestDate}</strong></div>
      </div>

      <section className="overview-metrics" aria-label="Class attendance summary">
        <div className="overview-metric"><span><CalendarDays size={15} /> Attendance rate</span><strong>{summary.attendanceRate ?? "—"}{summary.attendanceRate !== null && <small>%</small>}</strong><em>{summary.attendanceRate === null ? "No eligible attendance marks yet" : "(Present + late) ÷ (present + late + absent)"}</em></div>
        <div className="overview-metric"><span><CalendarDays size={15} /> Roster coverage</span><strong>{summary.coveragePercent}<small>%</small></strong><em>Expected student sessions with a mark</em></div>
        <div className="overview-metric"><span><UsersRound size={15} /> Students monitored</span><strong>{summary.students}</strong><em>In the loaded dataset</em></div>
        <div className="overview-metric"><span><CheckCircle2 size={15} /> Present marks</span><strong>{summary.present.toLocaleString()}</strong><em>Across {summary.sessions} recorded dates</em></div>
        <div className={`overview-metric ${summary.atRisk ? "overview-metric-risk" : ""}`}><span><CircleAlert size={15} /> Needs a check-in</span><strong>{summary.atRisk}</strong><em>Based on the brief’s risk rules</em></div>
      </section>

      <div className="overview-grid">
        <section className="panel overview-trend-panel">
          <div className="panel-heading">
            <div><SectionTitle title="Attendance trend" description="Present and late marks as a share of present, late, and absent marks at each session." /></div>
            <TrendRangeSelect value={range} onChange={setRange} />
          </div>
          <AttendanceTrendChart data={trend} compact />
          <div className="chart-footnote"><span>Excused and blank marks are excluded from the rate denominator.</span><Link to="/analytics">Explore analytics <ArrowRight size={14} /></Link></div>
        </section>

        <section className="panel class-panel">
          <div className="panel-heading"><SectionTitle title="Class snapshot" description="A quick read of recorded attendance." /></div>
          <div className="class-rate"><strong>{summary.attendanceRate ?? "—"}{summary.attendanceRate !== null && <span>%</span>}</strong><span>{summary.attendanceRate === null ? "No eligible marks recorded" : "present across eligible class marks"}</span></div>
          {summary.attendanceRate !== null && <div className="class-rate-meter" role="meter" aria-label="Class attendance rate" aria-valuemin={0} aria-valuemax={100} aria-valuenow={summary.attendanceRate}>
            <div className="class-rate-track"><span style={{ width: `${Math.min(summary.attendanceRate, 100)}%` }} /><i /></div>
            <div><span>0%</span><strong>75% review threshold</strong><span>100%</span></div>
          </div>}
          <div className="class-status-list">
            <div><span><i className="status-dot status-dot-present" />Present</span><strong>{summary.present}</strong></div>
            <div><span><i className="status-dot status-dot-absent" />Absent</span><strong>{summary.absent}</strong></div>
            <div><span><i className="status-dot status-dot-late" />Late</span><strong>{summary.late}</strong></div>
          </div>
          <div className="class-panel-note"><span>{dataset.dates.length} class dates</span><span>Updated {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(dataset.importedAt))}</span></div>
        </section>
      </div>

      <section className="panel attention-panel">
        <div className="panel-heading attention-heading">
          <SectionTitle title="Students who may need attention" description="These flags follow the thresholds in your project brief. Review the class context before taking action." action={<Link className="button button-secondary" to="/students">View all students <ArrowRight size={15} /></Link>} />
        </div>
        {studentsAtRisk.length ? (
          <div className="data-table-wrap"><table className="data-table">
            <thead><tr><th>Student</th><th>Attendance</th><th>Present</th><th>Absent</th><th>Late</th><th>Flag</th><th><span className="sr-only">Open student</span></th></tr></thead>
            <tbody>{studentsAtRisk.slice(0, 5).map(({ student, metrics }) => (
              <tr key={student.id}>
                <td><div className="student-name-cell"><span className="student-avatar">{initials(student.name)}</span><span className="student-name-copy"><strong>{student.name}</strong><span>{student.program} · {student.section}</span></span></div></td>
                <td className={metrics.attendanceRateExact !== null && metrics.attendanceRateExact < 75 ? "rate-low" : ""}>{metrics.attendanceRate === null ? "—" : `${metrics.attendanceRate}%`}</td>
                <td>{metrics.present}</td><td>{metrics.absent}</td><td>{metrics.late}</td><td><RiskLabel reasons={metrics.riskReasons} /></td>
                <td><Link className="table-link" to={`/students/${student.id}`}>Review</Link></td>
              </tr>
            ))}</tbody>
          </table></div>
        ) : (
          <div className="all-clear"><CheckCircle2 size={19} /><div><strong>No students are flagged in this dataset</strong><span>Students will appear here when a brief threshold is reached.</span></div></div>
        )}
      </section>

      <section className="overview-bottom-row">
        <div className="source-note"><span className="source-icon"><FileUp size={16} /></span><div><strong>Current data source</strong><span>{dataset.sourceName} · {dataset.students.length} student records</span></div><Link to="/import"><ArrowDownToLine size={15} /> Add or update attendance</Link></div>
        <p className="risk-rule-note">Flags are based on attendance below 75%, five consecutive absences, or more than eight absences.</p>
      </section>
    </main>
  );
}

