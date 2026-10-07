export type AttendanceCode = "P" | "A" | "L" | "E";

export interface AttendanceSession {
  date: string;
  status: AttendanceCode | "";
}

export interface AttendanceStudent {
  id: string;
  name: string;
  gradeLevel?: string;
  program: string;
  section: string;
  subjectTitle?: string;
  subjectCode?: string;
  term?: string;
  sessions: AttendanceSession[];
}

export interface AttendanceMetadata {
  subjectTitle: string;
  subjectCode: string;
  term: string;
  program: string;
  section: string;
  scheduleDays: string[];
  scheduleTimes: string[];
}

export interface AttendanceDataset {
  metadata: AttendanceMetadata;
  sections: string[];
  dates: string[];
  students: AttendanceStudent[];
  sourceName: string;
  importedAt: string;
  expectedRosterByDate?: Record<string, number>;
}

export interface StudentMetrics {
  present: number;
  absent: number;
  late: number;
  recorded: number;
  attendanceRate: number | null;
  attendanceRateExact: number | null;
  excused: number;
  expected: number;
  consecutiveAbsences: number;
  riskReasons: string[];
  expectedSessions: number;
  coveragePercent: number;
  unrecorded: number;
}

export interface ForecastPoint {
  date: string;
  projectedRate: number;
  lowerBound: number;
  upperBound: number;
  sessionsUsed: number;
  meanCoverage: number;
}

export interface CsvIssue {
  row: number;
  message: string;
}

export interface CsvParseResult {
  dataset: AttendanceDataset | null;
  errors: CsvIssue[];
  warnings: CsvIssue[];
}
