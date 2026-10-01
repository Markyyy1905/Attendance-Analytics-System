import { createDemoDataset } from "../../mocks/attendanceDemo";
import type { AttendanceDataset } from "../../shared/types/attendance";

export interface AttendanceRepository {
  loadInitialDataset(): AttendanceDataset;
}

/** Demo adapter. Replace this adapter with an API-backed implementation when live data is ready. */
export const mockAttendanceRepository: AttendanceRepository = {
  loadInitialDataset: createDemoDataset,
};
