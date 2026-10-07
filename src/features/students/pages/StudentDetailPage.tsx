import { ArrowLeft, CalendarDays, CircleAlert } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { AttendanceMark, RiskLabel } from "../../../components/ui/AttendanceMark";
import { AttendanceTrendChart } from "../../../components/charts/AttendanceTrendChart";
import { PageHeader } from "../../../components/ui/PageHeader";
import { useAttendanceData } from "../../../app/providers/AttendanceDataProvider";
import { getDateTrend, getStudentMetrics } from "../../../shared/lib/attendanceMetrics";
import { EmptyState } from "../../../components/ui/PageHeader";
import "./StudentDetailPage.css";

function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }
function formatDate(date: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }

export function StudentDetailPage() {
  const { studentId } = useParams();
  const { dataset } = useAttendanceData();
  const student = dataset.students.find((item) => item.id === studentId);
  if (!student) return <main className="student-detail"><PageHeader title="Student not found" description="This student is not in the current attendance dataset." actions={<Link className="button button-secondary" to="/students"><ArrowLeft size={15} /> Back to students</Link>} /><EmptyState title="Choose a student from the class roster" description="The current dataset may have changed since this profile link was opened." /></main>;

  const metrics = getStudentMetrics(student);
  const studentTrend = getDateTrend({ ...dataset, students: [student] }).filter((point) => point.recorded > 0);

  return (
    <main className="student-detail">
      <PageHeader title="Student profile" description="Attendance history for this student in the current class." actions={<Link className="button button-secondary" to="/students"><ArrowLeft size={15} /> Back to students</Link>} />
      <section className="student-profile-banner"><span className="student-profile-avatar">{initials(student.name)}</span><div className="student-profile-title"><strong>{student.name}</strong><span>{student.program && student.program !== student.gradeLevel ? `${student.program} · ` : ""}Section {student.section}{student.gradeLevel ? ` · ${student.gradeLevel}` : ""}</span></div><div className="student-profile-status"><RiskLabel reasons={metrics.riskReasons} />{metrics.riskReasons.length > 0 && <span>{metrics.riskReasons.join(" · ")}</span>}</div></section>
      <div className="student-detail-metrics"><div><span>Attendance rate</span><strong>{metrics.attendanceRate === null ? "—" : `${metrics.attendanceRate}%`}</strong><small>{metrics.expected ? `${metrics.present + metrics.late}/${metrics.expected} eligible marks attended` : "No eligible marks"}</small></div><div><span>Roster coverage</span><strong>{metrics.coveragePercent}%</strong><small>{metrics.expectedSessions - metrics.unrecorded}/{metrics.expectedSessions} sessions marked</small></div><div><span>Present</span><strong>{metrics.present}</strong></div><div><span>Absent</span><strong>{metrics.absent}</strong></div><div><span>Late</span><strong>{metrics.late}</strong></div><div><span>Excused</span><strong>{metrics.excused}</strong></div></div>
      <div className="student-detail-grid">
        <section className="panel"><div className="panel-heading"><div><h2>Attendance trend</h2><p>Attendance rate by recorded date for this profile's full history.</p></div></div><AttendanceTrendChart data={studentTrend} compact /></section>
        <section className="panel student-risk-panel"><div className="panel-heading"><div><h2>Review notes</h2><p>Thresholds from the project brief.</p></div><CircleAlert size={17} /></div>{metrics.riskReasons.length ? <ul>{metrics.riskReasons.map((reason) => <li key={reason}>{reason}</li>)}</ul> : <div className="student-on-track"><span>✓</span><div><strong>No risk thresholds reached</strong><p>Continue monitoring the attendance pattern.</p></div></div>}<p className="student-review-note">Review the underlying marks and class context before following up.</p></section>
      </div>
      <section className="panel student-history-panel"><div className="panel-heading"><div><h2>Attendance history</h2><p>Recorded marks for {dataset.metadata.subjectCode || "this class"}.</p></div><span className="panel-tag"><CalendarDays size={14} /> {dataset.dates.length} dates</span></div><div className="student-history-grid">{student.sessions.map((session, index) => <div className="student-history-item" key={`${session.date}-${index}`}><span>{formatDate(session.date)}</span><AttendanceMark status={session.status} /></div>)}</div></section>
    </main>
  );
}


