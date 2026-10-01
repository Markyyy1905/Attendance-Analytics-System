import { useId } from "react";
import type { ReturnTypeGetDateTrend } from "../../shared/types/chart";

export function AttendanceTrendChart({ data, compact = false }: { data: ReturnTypeGetDateTrend[]; compact?: boolean }) {
  const gradientId = useId().replace(/:/g, "");
  if (!data.length) return <div className="chart-empty">Add dated attendance records to see a trend.</div>;

  const width = 760;
  const height = compact ? 198 : 250;
  const left = 40;
  const right = width - 16;
  const top = 22;
  const bottom = height - 34;
  const pointX = (index: number) => left + (data.length === 1 ? 0 : (index / (data.length - 1)) * (right - left));
  const pointY = (value: number) => bottom - (Math.max(0, Math.min(100, value)) / 100) * (bottom - top);
  const line = data.map((item, index) => `${index ? "L" : "M"}${pointX(index)} ${pointY(item.rate)}`).join(" ");
  const area = `${line} L${right} ${bottom} L${left} ${bottom} Z`;
  const labels = data.length <= 5 ? data : data.filter((_, index) => index === 0 || index === data.length - 1 || index % Math.ceil(data.length / 4) === 0);

  return (
    <div className={`trend-chart ${compact ? "trend-chart-compact" : ""}`}>
      <div className="chart-legend"><span><i /> Present rate</span><small>Rate = present marks ÷ recorded marks</small></div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Present rate trend across attendance dates" preserveAspectRatio="none">
        <defs><linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--chart-fill)" stopOpacity=".22" /><stop offset="100%" stopColor="var(--chart-fill)" stopOpacity="0" /></linearGradient></defs>
        {[0, 25, 50, 75, 100].map((value) => <g key={value}><line x1={left} x2={right} y1={pointY(value)} y2={pointY(value)} className="chart-grid-line" /><text x={left - 10} y={pointY(value) + 4} textAnchor="end" className="chart-axis-label">{value}%</text></g>)}
        <path d={area} fill={`url(#${gradientId})`} />
        <path d={line} fill="none" className="chart-line" vectorEffect="non-scaling-stroke" />
        {data.map((item, index) => <g key={`${item.date}-${index}`}><circle cx={pointX(index)} cy={pointY(item.rate)} r="4" className="chart-point"><title>{item.date}: {item.rate}% present</title></circle></g>)}
        {labels.map((item) => {
          const index = data.indexOf(item);
          return <text key={`${item.date}-${index}`} x={pointX(index)} y={height - 9} textAnchor="middle" className="chart-axis-label">{new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${item.date}T00:00:00Z`))}</text>;
        })}
      </svg>
    </div>
  );
}
