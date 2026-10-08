import type { AttendanceDataset, StudentMetrics } from "../../../shared/types/attendance";
import { getDateTrend, getDatasetSummary, getWeekdayTrend, getAttendanceForecast } from "../../../shared/lib/attendanceMetrics";

type Summary = ReturnType<typeof getDatasetSummary>;
type Trend = ReturnType<typeof getDateTrend>;
type Weekdays = ReturnType<typeof getWeekdayTrend>;
type Forecast = ReturnType<typeof getAttendanceForecast>;

export interface AnalyticsReportInput {
  dataset: AttendanceDataset;
  summary: Summary;
  trend: Trend;
  weekdays: Weekdays;
  forecast: Forecast;
  students: Array<{ name: string; section: string; gradeLevel?: string; metrics: StudentMetrics }>;
  reportId: string;
  generatedAt: string;
  filters: { section: string; dateRange: string; studentSearchApplied: boolean; reviewStatus?: string; recordCompleteness?: string };
}

function csvCell(value: unknown) {
  let text = String(value ?? "");
  if (/^[\t\r ]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function buildAnalyticsCsv(report: AnalyticsReportInput) {
  const { dataset, summary, trend, weekdays, forecast, students } = report;
  const dates = dataset.dates;
  const rows: unknown[][] = [
    ["TalaTrack class analytics report"],
    ["Report ID", report.reportId],
    ["Generated at (UTC)", report.generatedAt],
    ["Class", dataset.metadata.subjectTitle || "Current class"],
    ["Course code", dataset.metadata.subjectCode],
    ["Section", report.filters.section],
    ["Term", dataset.metadata.term],
    ["Date range", dates.length ? `${dates[0]} to ${dates.at(-1)}` : "No eligible dates"],
    ["Section filter", report.filters.section],
    ["Date filter", report.filters.dateRange],
    ["Student search", report.filters.studentSearchApplied ? "Applied" : "All students"],
    [],
    ["CLASS SUMMARY"],
    ["Attendance rate", summary.attendanceRate === null ? "No eligible marks" : `${summary.attendanceRate}%`],
    ["Rate formula", "(Present + late) / (present + late + absent)"],
    ["Rate treatment", "Late counts as attended; excused and unrecorded marks are excluded"],
    ["Roster coverage", `${summary.coveragePercent}%`],
    ["Students", summary.students],
    ["Sessions", summary.sessions],
    ["Present", summary.present],
    ["Late", summary.late],
    ["Absent", summary.absent],
    ["Excused", summary.excused],
    ["Unrecorded", summary.unrecorded],
    ["Students needing review", summary.atRisk],
    [],
    ["SESSION TREND"],
    ["Date", "Rate", "Present", "Late", "Absent", "Excused", "Eligible marks", "Expected roster", "Unrecorded", "Coverage"],
    ...trend.map((point) => [point.date, `${point.rate}%`, point.present, point.late, point.absent, point.excused, point.recorded, point.expected, point.unrecorded, `${point.coveragePercent}%`]),
    [],
    ["WEEKDAY BREAKDOWN"],
    ["Weekday", "Rate", "Sessions", "Present", "Late", "Absent", "Excused", "Eligible marks", "Expected roster", "Unrecorded", "Coverage"],
    ...weekdays.map((day) => [day.day, `${day.rate}%`, day.sessions, day.present, day.late, day.absent, day.excused, day.denominator, day.expected, day.unrecorded, `${day.coverage}%`]),
    [],
    ["STUDENT RESULTS"],
    ["Student", "Grade / year", "Section", "Attendance rate", "Present", "Late", "Absent", "Excused", "Unrecorded", "Coverage", "Review reasons"],
    ...students.map(({ name, section, gradeLevel, metrics }) => [name, gradeLevel || "Not provided", section, metrics.attendanceRate === null ? "No eligible marks" : `${metrics.attendanceRate}%`, metrics.present, metrics.late, metrics.absent, metrics.excused, metrics.unrecorded, `${metrics.coveragePercent}%`, metrics.riskReasons.join("; ") || "None"]),
    [],
    ["CLASS-LEVEL PROJECTION"],
    ["Projection date", "Projected rate", "90% planning interval", "Sessions used", "Mean coverage"],
    ...(forecast.length
      ? forecast.map((point) => [point.date, `${point.projectedRate}%`, `${point.lowerBound}%–${point.upperBound}%`, point.sessionsUsed, `${point.meanCoverage}%`])
      : [["Not available", "At least six sufficiently covered sessions are required", "", "", ""]]),
    [],
    ["Method note", "Projection is class-level decision support, not a validated prediction or an individual student forecast."],
  ];

  return `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
}

export function analyticsReportFilename(dataset: AttendanceDataset) {
  const safe = (value: string) => value.normalize("NFKD").replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "class";
  const dates = dataset.dates;
  const period = dates.length ? `${dates[0]}_${dates.at(-1)}` : "no-dates";
  return `TalaTrack_${safe(dataset.metadata.subjectCode || dataset.metadata.subjectTitle)}_${safe(dataset.metadata.section)}_analytics_${period}.csv`;
}
