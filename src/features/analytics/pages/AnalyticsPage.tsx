import { useMemo, useState } from "react";
import { ArrowRight, CircleAlert, FileUp } from "lucide-react";
import { Link } from "react-router-dom";
import { AttendanceTrendChart } from "../../../components/charts/AttendanceTrendChart";
import { RiskLabel } from "../../../components/ui/AttendanceMark";
import { EmptyState, PageHeader } from "../../../components/ui/PageHeader";
import { useAttendanceData } from "../../../app/providers/AttendanceDataProvider";
import { getAttendanceForecast, getDateTrend, getDatasetSummary, getStudentMetrics, getWeekdayTrend } from "../../../shared/lib/attendanceMetrics";
import "./AnalyticsPage.css";

export function AnalyticsPage() {
  const { dataset, isLoading, dataError } = useAttendanceData();
  const [sectionFilter, setSectionFilter] = useState("all");
  const [rangeFilter, setRangeFilter] = useState("all");
  const [studentFilter, setStudentFilter] = useState("");
  const sections = [...new Set(dataset.students.map((student) => student.section).filter(Boolean))].sort();
  const scopedDataset = useMemo(() => {
    const query = studentFilter.trim().toLocaleLowerCase();
    const students = dataset.students.filter((student) =>
      (sectionFilter === "all" || student.section === sectionFilter) &&
      (!query || student.name.toLocaleLowerCase().includes(query)),
    );
    const limit = rangeFilter === "recent5" ? 5 : rangeFilter === "recent10" ? 10 : dataset.dates.length;
    const dates = dataset.dates.slice(-limit);
    const includedDates = new Set(dates);
    return { ...dataset, dates, students: students.map((student) => ({ ...student, sessions: student.sessions.filter((session) => includedDates.has(session.date)) })) };
  }, [dataset, sectionFilter, rangeFilter, studentFilter]);
  const summary = useMemo(() => getDatasetSummary(scopedDataset), [scopedDataset]);
  const trend = useMemo(() => getDateTrend(scopedDataset), [scopedDataset]);
  const weekdays = useMemo(() => getWeekdayTrend(scopedDataset), [scopedDataset]);
  const forecast = useMemo(() => getAttendanceForecast(scopedDataset), [scopedDataset]);
  const needsReview = scopedDataset.students
    .map((student) => ({ student, metrics: getStudentMetrics(student) }))
    .filter((item) => item.metrics.riskReasons.length > 0)
    .sort((a, b) => (a.metrics.attendanceRateExact ?? 101) - (b.metrics.attendanceRateExact ?? 101));
  const midpoint = Math.floor(trend.length / 2);
  const periodRate = (points: typeof trend) => {
    const denominator = points.reduce((sum, point) => sum + point.recorded, 0);
    return denominator ? Math.round(points.reduce((sum, point) => sum + point.present + point.late, 0) / denominator * 100) : null;
  };
  const periodChange = trend.length >= 2 ? (periodRate(trend.slice(midpoint)) ?? 0) - (periodRate(trend.slice(0, midpoint)) ?? 0) : null;
  const maxMark = Math.max(summary.present, summary.absent, summary.late, summary.excused, summary.unrecorded, 1);

  if (!dataset.students.length) return <main className="page-analytics">
    <PageHeader title="Class analytics" description="Explore attendance patterns within the selected teaching class." actions={<Link className="button button-secondary" to="/classes">Manage classes</Link>} />
    <section className="panel"><EmptyState title={isLoading ? "Loading class data" : dataError ? "Analytics unavailable" : "No class data selected"} description={isLoading ? "Retrieving the selected class from PostgreSQL." : dataError || "Select an assigned class or import attendance before reviewing trends and projections."} /></section>
  </main>;

  return (
    <main className="page-analytics">
      <PageHeader title="Class analytics" description="Explore attendance patterns across recorded sessions and identify where follow-up may help." actions={<Link className="button button-secondary" to="/import"><FileUp size={15} /> Import attendance</Link>} />
      <div className="analytics-scope"><span className="scope-dot" /><span>{dataset.metadata.subjectTitle || "Current class"}</span><i />{dataset.metadata.term || "Current term"}<i />{scopedDataset.dates.length} selected dates</div>
      <section className="panel analytics-trend-panel">
        <div className="analytics-filters" aria-label="Analytics filters">
          <label>Class / section<select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)}><option value="all">All sections</option>{sections.map((section) => <option value={section} key={section}>{section}</option>)}</select></label>
          <label>Date range<select value={rangeFilter} onChange={(event) => setRangeFilter(event.target.value)}><option value="all">All dates</option><option value="recent10">Recent 10 sessions</option><option value="recent5">Recent 5 sessions</option></select></label>
          <label>Student search<input value={studentFilter} onChange={(event) => setStudentFilter(event.target.value)} placeholder="Student name" /></label>
        </div>
        <div className="panel-heading"><div><h2>Attendance over time</h2><p>(Present + late) ÷ (present + late + absent). Excused and blank marks are excluded.</p></div><span className="panel-tag">{trend.length} sessions</span></div>
        <AttendanceTrendChart data={trend} />
        <div className="analytics-trend-summary"><div><span>Class attended rate</span><strong>{summary.attendanceRate === null ? "—" : `${summary.attendanceRate}%`}</strong></div><div><span>Roster coverage</span><strong>{summary.coveragePercent}%</strong></div><div><span>Highest session</span><strong>{trend.length ? Math.max(...trend.map((point) => point.rate)) : "—"}{trend.length ? "%" : ""}</strong></div><div><span>Latest session</span><strong>{trend.at(-1) ? `${trend.at(-1)!.rate}%` : "—"}</strong></div><div><span>First half vs second half</span><strong>{periodChange === null ? "—" : `${periodChange > 0 ? "+" : ""}${periodChange} pp`}</strong></div></div>
      </section>
      <section className="panel analytics-trend-panel">
        <div className="panel-heading"><div><h2>Attendance by weekday</h2><p>Weighted rate and denominator across the selected dates.</p></div></div>
        {weekdays.length ? <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Weekday</th><th>Rate</th><th>Present</th><th>Late</th><th>Absent</th><th>Denominator</th><th>Sessions</th><th>Coverage</th><th>Unrecorded</th></tr></thead><tbody>{weekdays.map((day) => <tr key={day.day}><td>{day.day}</td><td>{day.rate}%</td><td>{day.present}</td><td>{day.late}</td><td>{day.absent}</td><td>{day.denominator}</td><td>{day.sessions}</td><td>{day.coverage}%</td><td>{day.unrecorded}</td></tr>)}</tbody></table></div> : <div className="risk-empty">No recorded sessions match these filters.</div>}
      </section>
      <section className="panel analytics-trend-panel">
        <div className="panel-heading"><div><h2>Class-level projection</h2><p>Recency-weighted trend from six to eight eligible sessions. Ranges combine recent volatility and mark counts; this is not a validated prediction.</p></div><span className="panel-tag">{forecast.length ? `${forecast.length} sessions` : "Not enough evidence"}</span></div>
        {forecast.length ? <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Estimated next session</th><th>Projected rate</th><th>90% planning interval</th><th>Sessions used</th><th>Mean coverage</th></tr></thead><tbody>{forecast.map((point) => <tr key={point.date}><td>{point.date}</td><td>{point.projectedRate}%</td><td>{point.lowerBound}%–{point.upperBound}%</td><td>{point.sessionsUsed}</td><td>{point.meanCoverage}%</td></tr>)}</tbody></table></div> : <div className="risk-empty">Need at least six sessions with 60% or better roster coverage. Sparse or incomplete history stays unprojected.</div>}
      </section>
      <div className="analytics-detail-grid">
        <section className="panel status-breakdown-panel">
          <div className="panel-heading"><div><h2>Attendance status counts</h2><p>Totals for the selected filters.</p></div></div>
          <div className="status-breakdown-list">
            {[
              { label: "Present", value: summary.present, color: "present" },
              { label: "Absent", value: summary.absent, color: "absent" },
              { label: "Late", value: summary.late, color: "late" },
              { label: "Excused", value: summary.excused, color: "excused" },
              { label: "Unrecorded", value: summary.unrecorded, color: "unrecorded" },
            ].map((item) => <div className="status-breakdown" key={item.label}><div><span>{item.label}</span><strong>{item.value}</strong></div><div className="status-bar"><i className={`status-bar-${item.color}`} style={{ width: `${Math.max((item.value / maxMark) * 100, item.value ? 5 : 0)}%` }} /></div></div>)}
          </div>
          <div className="analytics-assumption"><CircleAlert size={15} /><span>Excused and blank marks are not included in the rate denominator.</span></div>
        </section>
        <section className="panel risk-breakdown-panel">
          <div className="panel-heading"><div><h2>Students needing review</h2><p>Each condition triggers independently; staff review the evidence.</p></div><span className="risk-count">{needsReview.length}</span></div>
          <div className="risk-rule-list"><div><span>Attendance below</span><strong>75%</strong></div><div><span>Consecutive absences</span><strong>5</strong></div><div><span>Total absences above</span><strong>8</strong></div></div>
          {needsReview.length ? <div className="risk-review-list">{needsReview.slice(0, 4).map(({ student, metrics }) => <div className="risk-review-row" key={student.id}><div><strong>{student.name}</strong><span>{metrics.riskReasons[0]}</span></div><RiskLabel reasons={metrics.riskReasons} /></div>)}<Link to="/students" className="risk-view-all">View class roster <ArrowRight size={14} /></Link></div> : <div className="risk-empty">No students matching these filters meet the review rules.</div>}
        </section>
      </div>
      <div className="analytics-disclaimer">The projection is class-level only. It summarizes historical patterns and does not estimate any student's future attendance or trigger an intervention.</div>
    </main>
  );
}



