import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "../../types/domain";
export function AttendanceTrendChart({
  data,
  color = "#397b68",
}: {
  data: TrendPoint[];
  color?: string;
}) {
  return (
    <div className="chart-wrap large-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id={`trend-${color.replace("#", "")}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e5e9e4" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#5f6b65", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[70, 100]}
            tick={{ fill: "#5f6b65", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
          <Area
            type="monotone"
            dataKey="rate"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#trend-${color.replace("#", "")})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
