import { CalendarDays, Download } from "lucide-react";
import { AttendanceTrendChart } from "../../../components/charts/AttendanceTrendChart";
import { Button } from "../../../components/ui/Button";
import { MetricCard } from "../../../components/ui/MetricCard";
import { Card, SectionHeader } from "../../../components/ui/Card";
import { useAttendanceAnalytics } from "../hooks/useAttendanceAnalytics";
export function AnalyticsPage() {
  const { data } = useAttendanceAnalytics();
  return (
    <main className="content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Insights / Analytics</p>
          <h1>Attendance analytics</h1>
          <p className="heading-copy">
            Understand where attendance is improving, slipping, and calling for
            action.
          </p>
        </div>
        <div className="heading-actions">
          <Button variant="secondary">
            <CalendarDays size={16} /> This semester
          </Button>
          <Button>
            <Download size={16} /> Export analysis
          </Button>
        </div>
      </div>
      <div className="tab-strip">
        <button className="active">Overview</button>
        <button>Trend analysis</button>
        <button>Absence analysis</button>
        <button>Late analysis</button>
        <button>Comparative</button>
      </div>
      <div className="metric-grid">
        <MetricCard label="Attendance rate" value="92.4%" change="3.2%" />
        <MetricCard
          label="Absence rate"
          value="7.6%"
          change="1.4%"
          good={false}
        />
        <MetricCard label="Late rate" value="4.2%" change="0.8%" good={false} />
        <MetricCard
          label="At-risk share"
          value="3.8%"
          change="0.4%"
          good={false}
        />
      </div>
      <Card>
        <SectionHeader
          title="Semester trend"
          subtitle="A steady improvement since the first assessment period."
        />
        <AttendanceTrendChart data={data?.trendData ?? []} color="#607e9a" />
      </Card>
    </main>
  );
}
