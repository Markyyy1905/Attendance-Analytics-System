import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Filter,
  ShieldAlert,
  Upload,
  Users,
} from "lucide-react";
import { AttendanceTrendChart } from "../../../components/charts/AttendanceTrendChart";
import { Avatar } from "../../../components/ui/Avatar";
import { Badge, RiskBadge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { MetricCard } from "../../../components/ui/MetricCard";
import { Card, SectionHeader } from "../../../components/ui/Card";
import { Dropdown } from "../../../components/ui/Dropdown";
import { useAttendanceAnalytics } from "../../analytics/hooks/useAttendanceAnalytics";
import { useStudents } from "../../students/hooks/useStudents";
export function DashboardPage() {
  const analytics = useAttendanceAnalytics();
  const studentQuery = useStudents();
  const students = studentQuery.data ?? [];
  const data = analytics.data;
  return (
    <main className="content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Tuesday, September 30, 2024</p>
          <h1>Good morning, Camille</h1>
          <p className="heading-copy">
            Here is what is happening across your attendance workspace.
          </p>
        </div>
        <div className="heading-actions">
          <Dropdown label="Date range" value="month" options={[{ label: "Sep 01 – Sep 30", value: "month" }, { label: "This week", value: "week" }, { label: "This semester", value: "semester" }]} icon={<CalendarDays size={16} />} />
          <Button>
            <Upload size={16} /> Upload attendance
          </Button>
        </div>
      </div>
      <div className="filter-strip">
        <span className="filter-context">
          <span className="live-dot" /> Live overview
        </span>
        <Dropdown label="All departments" options={[{ label: "All departments", value: "all" }, { label: "Computer Studies", value: "computing" }, { label: "Business School", value: "business" }]} />
        <Dropdown label="All programs" options={[{ label: "All programs", value: "all" }, { label: "BS Information Technology", value: "bsit" }, { label: "BS Accountancy", value: "bsa" }]} />
        <Dropdown label="More filters" options={[{ label: "All year levels", value: "year" }, { label: "All faculty", value: "faculty" }, { label: "Recorded sessions only", value: "recorded" }]} icon={<Filter size={14} />} />
      </div>
      <div className="metric-grid">
        <MetricCard
          label="Overall attendance"
          value="92.4%"
          change="3.2%"
          icon={CalendarDays}
        />
        <MetricCard
          label="Students tracked"
          value="1,248"
          change="8.6%"
          icon={Users}
          tone="blue"
        />
        <MetricCard
          label="Present today"
          value="1,089"
          change="2.1%"
          icon={ArrowUpRight}
        />
        <MetricCard
          label="Students at risk"
          value="47"
          change="5 new"
          icon={ShieldAlert}
          tone="red"
          direction="up"
          good={false}
        />
      </div>
      <div className="dashboard-grid">
        <Card>
          <SectionHeader
            title="Attendance trend"
            subtitle="Average attendance rate over the selected period."
            action={
              <Button variant="ghost">
                View analytics <ChevronRight size={15} />
              </Button>
            }
          />
          <AttendanceTrendChart data={data?.trendData ?? []} />
        </Card>
        <Card>
          <SectionHeader
            title="Today’s distribution"
            subtitle="Attendance status across all classes."
          />
          <div className="distribution-list dashboard-distribution">
            {(data?.distribution ?? []).map((item) => (
              <div className="distribution-row" key={item.name}>
                <span>
                  <i style={{ background: item.color }} />
                  {item.name}
                </span>
                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
          <div className="distribution-total">
            <strong>92%</strong>
            <span>present today</span>
          </div>
        </Card>
      </div>
      <Card>
        <SectionHeader
          title="Students needing attention"
          subtitle="Students with attendance below your monitoring threshold."
          action={
            <Button variant="secondary">
              View at-risk students <ChevronRight size={14} />
            </Button>
          }
        />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Section</th>
                <th>Attendance</th>
                <th>Absences</th>
                <th>Risk level</th>
                <th>Last attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="student-cell">
                      <Avatar initials={student.initials} />
                      <div>
                        <strong>{student.name}</strong>
                        <span>{student.program}</span>
                      </div>
                    </div>
                  </td>
                  <td>{student.section}</td>
                  <td>{student.attendanceRate}%</td>
                  <td>{student.absences}</td>
                  <td>
                    <RiskBadge level={student.riskLevel} />
                  </td>
                  <td>{student.lastAttendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
