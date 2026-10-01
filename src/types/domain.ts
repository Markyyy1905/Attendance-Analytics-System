export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'official_activity';
export type RiskLevel = 'good' | 'monitoring' | 'at_risk' | 'critical';
export type UserRole = 'faculty' | 'program_coordinator' | 'department_head' | 'administrator';

export interface Student { id: string; name: string; initials: string; program: string; section: string; attendanceRate: number; absences: number; consecutiveAbsences: number; riskLevel: RiskLevel; lastAttendance: string; }
export interface AttendanceRecord { id: string; date: string; studentId: string; studentName: string; course: string; section: string; status: AttendanceStatus; timeIn: string; }
export interface TrendPoint { day: string; rate: number; }
export interface CourseRate { name: string; rate: number; }
export interface Notification { id: string; title: string; description: string; time: string; read: boolean; }
