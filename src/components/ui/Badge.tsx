import type { ReactNode } from 'react';
import { cn, riskLabels, statusLabels } from '../../lib/utils';
import type { AttendanceStatus, RiskLevel } from '../../types/domain';

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: string }) { return <span className={cn('badge', `badge-${tone}`)}><span className="badge-dot" />{children}</span>; }
export function RiskBadge({ level }: { level: RiskLevel }) { return <Badge tone={level === 'critical' ? 'danger' : level === 'at_risk' ? 'warning' : level === 'good' ? 'success' : 'neutral'}>{riskLabels[level]}</Badge>; }
export function StatusBadge({ status }: { status: AttendanceStatus }) { return <Badge tone={status === 'present' ? 'success' : status === 'absent' ? 'danger' : status === 'late' ? 'warning' : 'neutral'}>{statusLabels[status]}</Badge>; }
