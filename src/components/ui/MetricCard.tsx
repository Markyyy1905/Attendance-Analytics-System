import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';

type MetricCardProps = {
  label: string;
  value: string;
  change: string;
  icon?: LucideIcon;
  tone?: 'green' | 'blue' | 'red';
  direction?: 'up' | 'down'; // which way the number moved
  good?: boolean; // is that movement good news?
};

export function MetricCard({ label, value, change, icon: Icon, tone = 'green', direction = 'up', good = true }: MetricCardProps) {
  const Arrow = direction === 'up' ? ArrowUpRight : ArrowDownRight;
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        {Icon && (
          <span className={`metric-icon ${tone}`}>
            <Icon size={17} aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-foot">
        <span className={`trend ${good ? 'positive' : 'negative'}`}>
          <Arrow size={13} aria-hidden="true" />
          {change}
          <span className="sr-only">{good ? ' (improved)' : ' (worsened)'}</span>
        </span>
        <span>vs last period</span>
      </div>
    </article>
  );
}
