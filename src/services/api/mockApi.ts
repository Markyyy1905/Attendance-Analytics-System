import { attendanceRecords } from '../../mocks/attendance';
import { students } from '../../mocks/students';
import { courseRates, distribution, trendData } from '../../mocks/analytics';

const wait = (ms = 140) => new Promise((resolve) => setTimeout(resolve, ms));
export const mockApi = {
  async getStudents() { await wait(); return students; },
  async getAttendanceRecords() { await wait(); return attendanceRecords; },
  async getAnalytics() { await wait(); return { trendData, courseRates, distribution }; },
};
