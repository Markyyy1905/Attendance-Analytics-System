export type AttendanceCode = "P" | "A" | "L";

export interface AttendanceSession {
  date: string;
  status: AttendanceCode | "";
}

export interface AttendanceStudent {
  id: string;
  name: string;
  program: string;
  section: string;
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
}

export interface StudentMetrics {
  present: number;
  absent: number;
  late: number;
  recorded: number;
  attendanceRate: number;
  consecutiveAbsences: number;
  riskReasons: string[];
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
