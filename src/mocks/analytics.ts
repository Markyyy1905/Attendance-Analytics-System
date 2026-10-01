import type { CourseRate, TrendPoint } from '../types/domain';
export const trendData: TrendPoint[] = [
  { day: 'Aug 19', rate: 86 }, { day: 'Aug 22', rate: 88 }, { day: 'Aug 26', rate: 84 }, { day: 'Aug 29', rate: 90 }, { day: 'Sep 02', rate: 89 }, { day: 'Sep 05', rate: 92 }, { day: 'Sep 09', rate: 91 }, { day: 'Sep 12', rate: 94 }, { day: 'Sep 16', rate: 93 }, { day: 'Sep 19', rate: 95 }, { day: 'Sep 23', rate: 94 }, { day: 'Sep 26', rate: 96 },
];
export const courseRates: CourseRate[] = [{ name: 'BSIT 2A', rate: 96 }, { name: 'BSA 1B', rate: 93 }, { name: 'BSBA 3A', rate: 89 }, { name: 'BSED 2C', rate: 87 }, { name: 'BSN 1A', rate: 84 }];
export const distribution = [{ name: 'Present', value: 78, color: '#397b68' }, { name: 'Late', value: 9, color: '#d89a45' }, { name: 'Absent', value: 8, color: '#cf5b53' }, { name: 'Excused', value: 5, color: '#aeb7ae' }];
