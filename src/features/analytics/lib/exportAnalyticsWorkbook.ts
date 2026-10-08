import type { AnalyticsReportInput } from "./exportAnalyticsCsv";

function xml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function cell(value: unknown, style = "Cell") {
  const text = String(value ?? "");
  const type = typeof value === "number" ? "Number" : "String";
  return '<Cell ss:StyleID="' + style + '"><Data ss:Type="' + type + '">' + xml(text) + "</Data></Cell>";
}

function row(values: unknown[], style?: string) {
  return "<Row>" + values.map((value) => cell(value, style)).join("") + "</Row>";
}

function styledRow(values: Array<{ value: unknown; style?: string }>, height?: number) {
  return '<Row' + (height ? ' ss:Height="' + height + '"' : "") + '>' +
    values.map(({ value, style }) => cell(value, style)).join("") +
    "</Row>";
}

function titleRow(title: string, columns: number) {
  return '<Row ss:Height="34"><Cell ss:StyleID="Title" ss:MergeAcross="' + (columns - 1) + '"><Data ss:Type="String">' + xml(title) + "</Data></Cell></Row>";
}

function sheet(name: string, rows: string, widths: number[]) {
  const columns = widths.map((width) => '<Column ss:Width="' + width + '"/>').join("");
  return '<Worksheet ss:Name="' + xml(name) + '"><Table ss:DefaultRowHeight="20">' + columns + rows +
    '</Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><FreezePanes/><FrozenNoSplit/><SplitHorizontal>2</SplitHorizontal><TopRowBottomPane>2</TopRowBottomPane><ProtectObjects>False</ProtectObjects><ProtectScenarios>False</ProtectScenarios></WorksheetOptions></Worksheet>';
}

function bar(value: number, width = 24) {
  const safe = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  const filled = Math.round((safe / 100) * width);
  return "█".repeat(filled) + "░".repeat(width - filled) + " " + Math.round(safe) + "%";
}

function rate(value: number | null) {
  return value === null ? "No eligible marks" : String(value) + "%";
}

export function buildAnalyticsWorkbook(report: AnalyticsReportInput) {
  const { dataset, summary, trend, weekdays, forecast, students } = report;
  const dates = dataset.dates;
  const eligibleMarks = summary.present + summary.late + summary.absent;
  const highestSession = trend.length ? Math.max(...trend.map((point) => point.rate)) : null;
  const lowestSession = trend.length ? Math.min(...trend.map((point) => point.rate)) : null;
  const latestRate = trend.length ? trend[trend.length - 1].rate : null;
  const attendanceStatus = summary.atRisk ? "Students need review" : "No active review flags";
  const attendanceStatusStyle = summary.atRisk ? "Warning" : "Muted";
  const summaryRows = [
    titleRow("TalaTrack attendance analytics report", 2),
    row(["Purpose", "Decision-support summary for attendance review, class monitoring, and follow-up."], "Note"),
    row(["Report ID", report.reportId]),
    row(["Generated at (UTC)", report.generatedAt]),
    row(["Class", dataset.metadata.subjectTitle || "Current class"]),
    row(["Course code", dataset.metadata.subjectCode || "Not provided"]),
    row(["Section", report.filters.section || dataset.metadata.section || "All sections"]),
    row(["Term", dataset.metadata.term || "Not provided"]),
    row(["Date range", dates.length ? String(dates[0]) + " to " + String(dates[dates.length - 1]) : "No eligible dates"]),
    row(["Review status filter", report.filters.reviewStatus || "all"]),
    row(["Record completeness filter", report.filters.recordCompleteness || "all"]),
    row([], "Cell"),
    row(["CLASS SUMMARY"], "Section"),
    row(["Attendance rate", rate(summary.attendanceRate)], "Metric"),
    row(["Rate formula", "(Present + late) / (present + late + absent)"]),
    row(["Late treatment", "Late marks count as attended in the rate numerator."]),
    row(["Excused treatment", "Excused marks are shown separately and excluded from the rate denominator."]),
    row(["Missing treatment", "Blank/unrecorded marks are excluded from the rate and reduce roster coverage."]),
    row(["Rounding", "Displayed percentages are rounded to the nearest whole percent."]),
    row(["Roster coverage", String(summary.coveragePercent) + "%"]),
    row(["Students monitored", summary.students]),
    row(["Sessions", summary.sessions]),
    row(["Present marks", summary.present]),
    row(["Late marks", summary.late]),
    row(["Absent marks", summary.absent]),
    row(["Excused marks", summary.excused]),
    row(["Unrecorded marks", summary.unrecorded]),
    row(["Eligible marks", eligibleMarks]),
    row(["Students needing review", summary.atRisk]),
    row(["Highest session rate", highestSession === null ? "No session data" : String(highestSession) + "%"]),
    row(["Lowest session rate", lowestSession === null ? "No session data" : String(lowestSession) + "%"]),
    row(["Latest session rate", latestRate === null ? "No session data" : String(latestRate) + "%"]),
    row([], "Cell"),
    row(["INTERPRETATION AND USE"], "Section"),
    row(["How to read this report", "Use Summary for the headline result, Session trend for change over time, Weekday analysis for schedule patterns, and Student results for individual review."]),
    row(["Review rule", "Students with three or more absences in the selected period need review."]),
    row(["Projection note", "Projection is class-level decision support based on historical patterns. It is not a validated individual prediction."]),
  ].join("");

  const trendRows = [
    row(["SESSION TREND"], "Section"),
    row(["Date", "Rate", "Visual trend", "Present", "Late", "Absent", "Excused", "Eligible marks", "Expected roster", "Unrecorded", "Coverage"], "Header"),
    ...trend.map((point, index) => row([point.date, rate(point.rate), bar(point.rate), point.present, point.late, point.absent, point.excused, point.recorded, point.expected, point.unrecorded, String(point.coveragePercent) + "%"], index % 2 ? "AltCell" : "Cell")),
  ].join("");

  const weekdayRows = [
    row(["WEEKDAY BREAKDOWN"], "Section"),
    row(["Weekday", "Rate", "Visual comparison", "Sessions", "Present", "Late", "Absent", "Excused", "Eligible marks", "Expected roster", "Unrecorded", "Coverage"], "Header"),
    ...weekdays.map((day, index) => row([day.day, rate(day.rate), bar(day.rate), day.sessions, day.present, day.late, day.absent, day.excused, day.denominator, day.expected, day.unrecorded, String(day.coverage) + "%"], index % 2 ? "AltCell" : "Cell")),
  ].join("");

  const studentRows = [
    row(["STUDENT RESULTS"], "Section"),
    row(["Student", "Grade / year", "Section", "Attendance rate", "Visual rate", "Present", "Late", "Absent", "Excused", "Unrecorded", "Coverage", "Review reasons"], "Header"),
    ...students.map(({ name, section, gradeLevel, metrics }, index) => row([name, gradeLevel || "Not provided", section, rate(metrics.attendanceRate), metrics.attendanceRate === null ? "No data" : bar(metrics.attendanceRate), metrics.present, metrics.late, metrics.absent, metrics.excused, metrics.unrecorded, String(metrics.coveragePercent) + "%", metrics.riskReasons.join("; ") || "None"], index % 2 ? "AltCell" : "Cell")),
  ].join("");

  const projectionRows = [
    row(["CLASS-LEVEL PROJECTION"], "Section"),
    row(["Projection date", "Projected rate", "90% planning interval", "Sessions used", "Mean coverage"], "Header"),
    ...(forecast.length
      ? forecast.map((point) => row([point.date, rate(point.projectedRate), String(point.lowerBound) + "% to " + String(point.upperBound) + "%", point.sessionsUsed, String(point.meanCoverage) + "%"]))
      : [row(["Not available", "At least six sufficiently covered sessions are required."])])
    ,
    row([], "Cell"),
    row(["Method note", "Recency-weighted class trend with a planning interval; review data quality before acting."] , "Note"),
  ].join("");

  const visualRows = [
    titleRow("TalaTrack class analytics", 5),
    styledRow([
      { value: dataset.metadata.subjectTitle || "Current class", style: "Subtitle" },
      { value: dataset.metadata.subjectCode || "", style: "Subtitle" },
      { value: report.filters.section || dataset.metadata.section || "All sections", style: "Subtitle" },
      { value: dataset.metadata.term || "", style: "Subtitle" },
      { value: dates.length ? String(dates[0]) + " to " + String(dates[dates.length - 1]) : "No eligible dates", style: "Subtitle" },
    ], 26),
    row([], "Cell"),
    row(["KEY RESULTS"], "Section"),
    styledRow([
      { value: "Attendance rate", style: "KpiLabel" },
      { value: "Roster coverage", style: "KpiLabel" },
      { value: "Students", style: "KpiLabel" },
      { value: "Sessions", style: "KpiLabel" },
      { value: "Students needing review", style: "KpiLabel" },
    ], 24),
    styledRow([
      { value: rate(summary.attendanceRate), style: "Kpi" },
      { value: String(summary.coveragePercent) + "%", style: "Kpi" },
      { value: summary.students, style: "Kpi" },
      { value: summary.sessions, style: "Kpi" },
      { value: summary.atRisk, style: summary.atRisk ? "KpiDanger" : "KpiSuccess" },
    ], 32),
    styledRow([
      { value: attendanceStatus, style: attendanceStatusStyle },
      { value: summary.coveragePercent >= 90 ? "Complete" : "Check missing marks", style: summary.coveragePercent >= 90 ? "Success" : "Warning" },
      { value: "Highest session " + (highestSession === null ? "—" : highestSession + "%"), style: "Muted" },
      { value: "Latest session " + (latestRate === null ? "—" : latestRate + "%"), style: "Muted" },
      { value: summary.atRisk ? "Follow-up required" : "No active flags", style: summary.atRisk ? "Danger" : "Success" },
    ], 24),
    row([], "Cell"),
    row(["ATTENDANCE TREND BY SESSION"], "Section"),
    row(["Date", "Rate", "Chart"], "Header"),
    ...trend.map((point, index) => styledRow([
      { value: point.date, style: index % 2 ? "AltCell" : "Cell" },
      { value: rate(point.rate), style: "PercentCell" },
      { value: bar(point.rate, 40), style: "Chart" },
    ])),
    row([], "Cell"),
    row(["ATTENDANCE BY WEEKDAY"], "Section"),
    row(["Weekday", "Rate", "Chart", "Sessions", "Coverage"], "Header"),
    ...weekdays.map((day, index) => styledRow([
      { value: day.day, style: index % 2 ? "AltCell" : "Cell" },
      { value: rate(day.rate), style: "PercentCell" },
      { value: bar(day.rate, 40), style: "Chart" },
      { value: day.sessions, style: index % 2 ? "AltCell" : "Cell" },
      { value: String(day.coverage) + "%", style: index % 2 ? "AltCell" : "Cell" },
    ])),
    row([], "Cell"),
    row(["STATUS DISTRIBUTION"], "Section"),
    row(["Status", "Count", "Share of eligible marks", "Chart"], "Header"),
    styledRow([{ value: "Present", style: "Success" }, { value: summary.present, style: "Cell" }, { value: eligibleMarks ? String(Math.round((summary.present / eligibleMarks) * 100)) + "%" : "0%", style: "PercentCell" }, { value: bar(eligibleMarks ? (summary.present / eligibleMarks) * 100 : 0, 40), style: "ChartSuccess" }]),
    styledRow([{ value: "Late", style: "Warning" }, { value: summary.late, style: "AltCell" }, { value: eligibleMarks ? String(Math.round((summary.late / eligibleMarks) * 100)) + "%" : "0%", style: "PercentCell" }, { value: bar(eligibleMarks ? (summary.late / eligibleMarks) * 100 : 0, 40), style: "ChartWarning" }]),
    styledRow([{ value: "Absent", style: "Danger" }, { value: summary.absent, style: "Cell" }, { value: eligibleMarks ? String(Math.round((summary.absent / eligibleMarks) * 100)) + "%" : "0%", style: "PercentCell" }, { value: bar(eligibleMarks ? (summary.absent / eligibleMarks) * 100 : 0, 40), style: "ChartDanger" }]),
    styledRow([{ value: "Excused", style: "Muted" }, { value: summary.excused, style: "AltCell" }, { value: "Excluded from rate", style: "Muted" }, { value: "", style: "AltCell" }]),
    styledRow([{ value: "Unrecorded", style: "Muted" }, { value: summary.unrecorded, style: "Cell" }, { value: "Excluded from rate", style: "Muted" }, { value: "", style: "Cell" }]),
    row([], "Cell"),
    row(["Legend", "Each bar is a compact visual representation of the percentage shown beside it."], "Note"),
  ].join("");

  const styles = '<Styles>' +
    '<Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Center"/><Font ss:FontName="Aptos" ss:Size="10" ss:Color="#0F172A"/></Style>' +
    '<Style ss:ID="Title"><Alignment ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="18" ss:Color="#FFFFFF"/><Interior ss:Color="#0F172A" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="Subtitle"><Alignment ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="10" ss:Color="#DCEBFF"/><Interior ss:Color="#172554" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#3B82F6"/></Borders></Style>' +
    '<Style ss:ID="Section"><Alignment ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="11" ss:Color="#FFFFFF"/><Interior ss:Color="#1D4ED8" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="Header"><Alignment ss:Vertical="Center" ss:WrapText="1"/><Font ss:Bold="1" ss:Color="#E2E8F0"/><Interior ss:Color="#1E293B" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#475569"/></Borders></Style>' +
    '<Style ss:ID="KpiLabel"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="9" ss:Color="#475569"/><Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#BFDBFE"/></Borders></Style>' +
    '<Style ss:ID="Kpi"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="18" ss:Color="#1D4ED8"/><Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="KpiSuccess"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="18" ss:Color="#047857"/><Interior ss:Color="#ECFDF5" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="KpiDanger"><Alignment ss:Horizontal="Center" ss:Vertical="Center"/><Font ss:Bold="1" ss:Size="18" ss:Color="#B91C1C"/><Interior ss:Color="#FEF2F2" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="Metric"><Font ss:Bold="1" ss:Color="#1D4ED8"/><Interior ss:Color="#DBEAFE" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="Note"><Alignment ss:WrapText="1" ss:Vertical="Center"/><Font ss:Italic="1" ss:Color="#475569"/><Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="Cell"><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/></Borders><Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="AltCell"><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/></Borders><Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="PercentCell"><Alignment ss:Horizontal="Right"/><Font ss:Bold="1" ss:Color="#1D4ED8"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/></Borders><Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="Chart"><Font ss:FontName="Consolas" ss:Color="#2563EB"/><Interior ss:Color="#EFF6FF" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="ChartSuccess"><Font ss:FontName="Consolas" ss:Color="#059669"/><Interior ss:Color="#ECFDF5" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="ChartWarning"><Font ss:FontName="Consolas" ss:Color="#D97706"/><Interior ss:Color="#FFFBEB" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="ChartDanger"><Font ss:FontName="Consolas" ss:Color="#DC2626"/><Interior ss:Color="#FEF2F2" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="Success"><Font ss:Bold="1" ss:Color="#047857"/><Interior ss:Color="#ECFDF5" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="Warning"><Font ss:Bold="1" ss:Color="#B45309"/><Interior ss:Color="#FFFBEB" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="Danger"><Font ss:Bold="1" ss:Color="#B91C1C"/><Interior ss:Color="#FEF2F2" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="Muted"><Font ss:Color="#64748B"/><Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/></Style>' +
    '</Styles>';

  return [
    '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>',
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">',
    styles,
    sheet("Dashboard", visualRows, [165, 125, 330, 125, 170]),
    sheet("Summary", summaryRows, [220, 520]),
    sheet("Session trend", trendRows, [110, 110, 250, 80, 65, 65, 65, 100, 105, 80, 80]),
    sheet("Weekday analysis", weekdayRows, [110, 110, 250, 75, 75, 65, 65, 70, 100, 105, 80, 80]),
    sheet("Student results", studentRows, [220, 100, 100, 110, 250, 70, 60, 70, 70, 80, 80, 300]),
    sheet("Projection", projectionRows, [130, 110, 190, 100, 110]),
    '</Workbook>',
  ].join("\n");
}

export function analyticsWorkbookFilename(dataset: AnalyticsReportInput["dataset"]) {
  const safe = (value: string) => value.normalize("NFKD").replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "class";
  const period = dataset.dates.length ? String(dataset.dates[0]) + "_" + String(dataset.dates[dataset.dates.length - 1]) : "no-dates";
  return "TalaTrack_" + safe(dataset.metadata.subjectCode || dataset.metadata.subjectTitle) + "_" + safe(dataset.metadata.section) + "_analytics_" + period + ".xls";
}
