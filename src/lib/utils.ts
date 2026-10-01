import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) { return clsx(inputs); }

export const riskLabels = { good: 'Good standing', monitoring: 'Monitoring', at_risk: 'At risk', critical: 'Critical' } as const;
export const statusLabels = { present: 'Present', absent: 'Absent', late: 'Late', excused: 'Excused', official_activity: 'Official activity' } as const;
