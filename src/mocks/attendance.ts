import type { AttendanceRecord } from '../types/domain';
export const attendanceRecords: AttendanceRecord[] = [
  { id: 'att-1', date: 'Sep 30, 2024', studentId: '2024-001', studentName: 'Maria Santos', course: 'Web Systems', section: 'BSIT 2A', status: 'present', timeIn: '08:58 AM' },
  { id: 'att-2', date: 'Sep 30, 2024', studentId: '2024-014', studentName: 'Joshua Dela Cruz', course: 'Financial Accounting', section: 'BSA 1B', status: 'late', timeIn: '01:17 PM' },
  { id: 'att-3', date: 'Sep 30, 2024', studentId: '2024-022', studentName: 'Angela Reyes', course: 'Business Research', section: 'BSBA 3A', status: 'absent', timeIn: '—' },
  { id: 'att-4', date: 'Sep 30, 2024', studentId: '2024-031', studentName: 'Carlo Mendoza', course: 'Web Systems', section: 'BSIT 2A', status: 'present', timeIn: '09:02 AM' },
  { id: 'att-5', date: 'Sep 30, 2024', studentId: '2024-047', studentName: 'Nicole Villanueva', course: 'Nursing Practice', section: 'BSN 1A', status: 'excused', timeIn: '08:47 AM' },
];
