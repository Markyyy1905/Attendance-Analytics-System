import type { Student } from '../types/domain';

export const students: Student[] = [
  { id: '2024-001', name: 'Maria Santos', initials: 'MS', program: 'BS Information Technology', section: 'BSIT 2A', attendanceRate: 68, absences: 9, consecutiveAbsences: 3, riskLevel: 'critical', lastAttendance: 'Sep 24, 2024' },
  { id: '2024-014', name: 'Joshua Dela Cruz', initials: 'JD', program: 'BS Accountancy', section: 'BSA 1B', attendanceRate: 74, absences: 7, consecutiveAbsences: 2, riskLevel: 'at_risk', lastAttendance: 'Sep 26, 2024' },
  { id: '2024-022', name: 'Angela Reyes', initials: 'AR', program: 'BS Business Administration', section: 'BSBA 3A', attendanceRate: 79, absences: 5, consecutiveAbsences: 1, riskLevel: 'monitoring', lastAttendance: 'Sep 27, 2024' },
  { id: '2024-031', name: 'Carlo Mendoza', initials: 'CM', program: 'BS Information Technology', section: 'BSIT 2A', attendanceRate: 82, absences: 4, consecutiveAbsences: 0, riskLevel: 'monitoring', lastAttendance: 'Sep 27, 2024' },
  { id: '2024-047', name: 'Nicole Villanueva', initials: 'NV', program: 'BS Nursing', section: 'BSN 1A', attendanceRate: 96, absences: 1, consecutiveAbsences: 0, riskLevel: 'good', lastAttendance: 'Sep 30, 2024' },
];
