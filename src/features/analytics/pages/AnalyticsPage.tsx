import { useMemo } from "react";
import { ArrowRight, CircleAlert, FileUp } from "lucide-react";
import { Link } from "react-router-dom";
import { AttendanceTrendChart } from "../../../components/charts/AttendanceTrendChart";
import { RiskLabel } from "../../../components/ui/AttendanceMark";
import { PageHeader } from "../../../components/ui/PageHeader";
import { useAttendanceData } from "../../../app/providers/AttendanceDataProvider";
import { getDateTrend, getDatasetSummary, getStudentMetrics } from "../../../shared/lib/attendanceMetrics";
import "./AnalyticsPage.css";

export function AnalyticsPage() {
  const { dataset } = useAttendanceData();
  const summary = getDatasetSummary(dataset);
  const trend = useMemo(() => getDateTrend(dataset), [dataset]);
  const needsReview = dataset.students
    .map((student) => ({ student, metrics: getStudentMetrics(student) }))
    .filter((item) => item.metrics.riskReasons.length > 0)
    .sort((a, b) => a.metrics.attendanceRate - b.metrics.attendanceRate);
  const maxMark = Math.max(summary.present, summary.absent, summary.late, 1);

  return (
    <main className="page-analytics">
      <PageHeader title="Class analytics" description="Explore attendance patterns across recorded sessions and identify where follow-up may help." actions={<Link className="button button-secondary" to="/import"><FileUp size={15} /> Replace dataset</Link>} />
      <div className="analytics-scope"><span className="scope-dot" /><span>{dataset.metadata.subjectTitle || "Current class"}</span><i />{dataset.metadata.term || "Current term"}<i />{dataset.dates.length} recorded dates</div>
      <section className="panel analytics-trend-panel">
        <div className="panel-heading"><div><h2>Attendance over time</h2><p>Present marks as a share of all recorded attendance marks per date.</p></div><span className="panel-tag">{trend.length} sessions</span></div>
        <AttendanceTrendChart data={trend} />
        <div className="analytics-trend-summary"><div><span>Average present rate</span><strong>{summary.attendanceRate}%</strong></div><div><span>Highest session</span><strong>{Math.max(...trend.map((point) => point.rate), 0)}%</strong></div><div><span>Latest session</span><strong>{trend.at(-1)?.rate ?? 0}%</strong></div></div>
      </section>
      <div className="analytics-detail-grid">
        <section className="panel status-breakdown-panel">
          <div className="panel-heading"><div><h2>Recorded status marks</h2><p>Totals for this class dataset.</p></div></div>
          <div className="status-breakdown-list">
            {[{ label: "Present", value: summary.present, color: "present" }, { label: "Absent", value: summary.absent, color: "absent" }, { label: "Late", value: summary.late, color: "late" }].map((item) => <div className="status-breakdown" key={item.label}><div><span>{item.label}</span><strong>{item.value}</strong></div><div className="status-bar"><i className={`status-bar-${item.color}`} style={{ width: `${Math.max((item.value / maxMark) * 100, item.value ? 5 : 0)}%` }} /></div></div>)}
          </div>
          <div className="analytics-assumption"><CircleAlert size={15} /><span>Demo formula: P ÷ all recorded marks. Late marks are reported separately.</span></div>
        </section>
        <section className="panel risk-breakdown-panel">
          <div className="panel-heading"><div><h2>Students needing review</h2><p>Flags match the rules in the attached project brief.</p></div><span className="risk-count">{needsReview.length}</span></div>
          <div className="risk-rule-list"><div><span>Attendance below</span><strong>75%</strong></div><div><span>Consecutive absences</span><strong>5</strong></div><div><span>Total absences above</span><strong>8</strong></div></div>
          {needsReview.length ? <div className="risk-review-list">{needsReview.slice(0, 4).map(({ student, metrics }) => <div className="risk-review-row" key={student.id}><div><strong>{student.name}</strong><span>{metrics.riskReasons[0]}</span></div><RiskLabel reasons={metrics.riskReasons} /></div>)}<Link to="/students" className="risk-view-all">View class roster <ArrowRight size={14} /></Link></div> : <div className="risk-empty">No risk rules are reached in this dataset yet.</div>}
        </section>
      </div>
      <div className="analytics-disclaimer">Analytics are calculated from the currently loaded prototype dataset. Confirm the attendance formula and intervention policy with your institution before using live data.</div>
    </main>
  );
}
