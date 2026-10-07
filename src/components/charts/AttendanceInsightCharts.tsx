import type { ForecastPoint } from "../../shared/types/attendance";
import type { ReturnTypeGetDateTrend } from "../../shared/types/chart";

type WeekdayPoint = {
  day: string;
  rate: number;
  sessions: number;
  denominator: number;
  coverage: number;
};

function shortDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}

export function WeekdayAttendanceChart({ data }: { data: WeekdayPoint[] }) {
  if (!data.length) return <div className="chart-empty">No weekday pattern is available for these filters.</div>;

  const width = 760;
  const left = 112;
  const plotWidth = 550;
  const top = 18;
  const rowHeight = 34;
  const height = top + data.length * rowHeight + 28;
  const description = data.map((point) => `${point.day}: ${point.rate}% attendance from ${point.denominator} eligible marks across ${point.sessions} sessions; ${point.coverage}% coverage`).join(". ");

  return (
    <div className="insight-chart weekday-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Weighted attendance rate by weekday. ${description}`}>
        {[0, 25, 50, 75, 100].map((tick) => {
          const x = left + (tick / 100) * plotWidth;
          return <g key={tick}><line x1={x} x2={x} y1={top - 6} y2={top + data.length * rowHeight - 4} className="chart-grid-line" /><text x={x} y={height - 5} textAnchor="middle" className="chart-axis-label">{tick}%</text></g>;
        })}
        {data.map((point, index) => {
          const y = top + index * rowHeight;
          const barWidth = (point.rate / 100) * plotWidth;
          return <g key={point.day}>
            <text x={left - 12} y={y + 15} textAnchor="end" className="chart-axis-label weekday-label">{point.day}</text>
            <rect x={left} y={y + 2} width={plotWidth} height="15" rx="5" className="insight-track" />
            <rect x={left} y={y + 2} width={barWidth} height="15" rx="5" className="insight-bar" />
            <text x={left + plotWidth + 12} y={y + 15} className="chart-axis-label weekday-value">{point.rate}%</text>
            <title>{`${point.day}: ${point.rate}% from ${point.denominator} eligible marks, ${point.sessions} sessions, ${point.coverage}% roster coverage`}</title>
          </g>;
        })}
      </svg>
    </div>
  );
}

export function AttendanceProjectionChart({ history, forecast }: { history: ReturnTypeGetDateTrend[]; forecast: ForecastPoint[] }) {
  if (!history.length || !forecast.length) return null;

  const observed = history.filter((point) => point.coveragePercent >= 60 && point.recorded > 0).slice(-8);
  if (observed.length < 6) return null;

  const width = 760;
  const height = 254;
  const left = 42;
  const right = width - 22;
  const top = 20;
  const bottom = height - 42;
  const totalSteps = observed.length + forecast.length - 1;
  const x = (step: number) => left + (step / Math.max(totalSteps, 1)) * (right - left);
  const y = (value: number) => bottom - (Math.max(0, Math.min(100, value)) / 100) * (bottom - top);
  const actualPath = observed.map((point, index) => `${index ? "L" : "M"}${x(index)} ${y(point.rate)}`).join(" ");
  const projectedPoints = [{ date: observed.at(-1)!.date, projectedRate: observed.at(-1)!.rate }, ...forecast];
  const projectedPath = projectedPoints.map((point, index) => `${index ? "L" : "M"}${x(observed.length - 1 + index)} ${y(point.projectedRate)}`).join(" ");
  const upper = forecast.map((point, index) => `${x(observed.length + index)} ${y(point.upperBound)}`);
  const lower = forecast.map((point, index) => `${x(observed.length + index)} ${y(point.lowerBound)}`).reverse();
  const band = `M${x(observed.length - 1)} ${y(observed.at(-1)!.rate)} L${upper.join(" L")} L${lower.join(" L")} Z`;
  const separator = (x(observed.length - 1) + x(observed.length)) / 2;
  const description = forecast.map((point) => `${point.date}: ${point.projectedRate}% projected, interval ${point.lowerBound} to ${point.upperBound}%`).join(". ");

  return (
    <div className="insight-chart projection-chart">
      <div className="projection-legend" aria-hidden="true"><span><i className="projection-legend-observed" />Recorded</span><span><i className="projection-legend-estimate" />Projected</span><span><i className="projection-legend-range" />90% planning interval</span></div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Recorded rates and an exploratory class-level projection. ${description}`}>
        {[0, 25, 50, 75, 100].map((tick) => <g key={tick}><line x1={left} x2={right} y1={y(tick)} y2={y(tick)} className="chart-grid-line" /><text x={left - 9} y={y(tick) + 4} textAnchor="end" className="chart-axis-label">{tick}%</text></g>)}
        <path d={band} className="projection-band" />
        <line x1={separator} x2={separator} y1={top} y2={bottom} className="projection-divider" />
        <path d={actualPath} className="projection-observed-line" />
        <path d={projectedPath} className="projection-estimate-line" />
        {observed.map((point, index) => <circle key={point.date} cx={x(index)} cy={y(point.rate)} r="3.5" className="projection-observed-point"><title>{`${point.date}: ${point.rate}% recorded rate`}</title></circle>)}
        {forecast.map((point, index) => <circle key={point.date} cx={x(observed.length + index)} cy={y(point.projectedRate)} r="4" className="projection-estimate-point"><title>{`${point.date}: ${point.projectedRate}% projected; interval ${point.lowerBound}-${point.upperBound}%`}</title></circle>)}
        <text x={left} y={height - 12} className="chart-axis-label">{shortDate(observed[0].date)}</text>
        <text x={separator} y={height - 12} textAnchor="middle" className="chart-axis-label">Projection</text>
        <text x={right} y={height - 12} textAnchor="end" className="chart-axis-label">{shortDate(forecast.at(-1)!.date)}</text>
      </svg>
    </div>
  );
}
