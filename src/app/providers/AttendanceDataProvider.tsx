import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { mockAttendanceRepository } from "../../services/attendance/attendanceRepository";
import type { AttendanceDataset } from "../../shared/types/attendance";

interface AttendanceDataContextValue {
  dataset: AttendanceDataset;
  isDemo: boolean;
  replaceDataset: (nextDataset: AttendanceDataset) => void;
  resetDemo: () => void;
}

const AttendanceDataContext = createContext<AttendanceDataContextValue | null>(null);

export function AttendanceDataProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<AttendanceDataset>(() => mockAttendanceRepository.loadInitialDataset());
  const [isDemo, setIsDemo] = useState(true);
  const value = useMemo(
    () => ({
      dataset,
      isDemo,
      replaceDataset: (nextDataset: AttendanceDataset) => {
        setDataset(nextDataset);
        setIsDemo(false);
      },
      resetDemo: () => {
        setDataset(mockAttendanceRepository.loadInitialDataset());
        setIsDemo(true);
      },
    }),
    [dataset, isDemo],
  );

  return <AttendanceDataContext.Provider value={value}>{children}</AttendanceDataContext.Provider>;
}

export function useAttendanceData() {
  const context = useContext(AttendanceDataContext);
  if (!context) throw new Error("useAttendanceData must be used inside AttendanceDataProvider");
  return context;
}
