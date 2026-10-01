import type { AttendanceDataset, AttendanceStudent } from "../shared/types/attendance";

const dates = [
  "2026-07-24",
  "2026-07-30",
  "2026-08-06",
  "2026-08-13",
  "2026-08-20",
  "2026-08-27",
  "2026-09-03",
  "2026-09-11",
  "2026-09-18",
  "2026-09-24",
  "2026-09-30",
  "2026-10-01",
];

const rows: Array<[string, string, string[]]> = [
  ["Alyssa Mendoza", "A", Array(12).fill("P")],
  ["Brandon Reyes", "B", ["P", "P", "P", "A", "P", "P", "P", "P", "P", "P", "P", "P"]],
  ["Camille Santos", "C", ["P", "P", "L", "P", "P", "P", "P", "P", "P", "P", "P", "P"]],
  ["Daniel Cruz", "D", ["P", "A", "P", "P", "P", "P", "P", "P", "P", "P", "P", "P"]],
  ["Ella Navarro", "E", ["P", "P", "P", "P", "P", "P", "A", "P", "P", "P", "P", "P"]],
  ["Felix Tan", "F", ["A", "A", "P", "P", "P", "P", "P", "P", "P", "P", "P", "P"]],
  ["Grace Flores", "G", ["P", "P", "P", "A", "A", "A", "A", "A", "A", "A", "A", "A"]],
  ["Hugo Garcia", "H", ["P", "L", "P", "P", "P", "P", "P", "P", "P", "P", "P", "P"]],
  ["Isabel Lim", "I", ["P", "P", "P", "P", "P", "P", "P", "A", "P", "P", "P", "P"]],
  ["Jordan Bautista", "J", ["A", "A", "A", "A", "A", "P", "P", "P", "P", "P", "P", "P"]],
  ["Kyla Ramos", "K", Array(12).fill("P")],
  ["Liam Villanueva", "L", ["P", "A", "P", "P", "P", "P", "P", "P", "A", "A", "A", "A"]],
  ["Mia Castillo", "M", ["P", "P", "P", "L", "P", "P", "P", "P", "P", "P", "P", "P"]],
  ["Noah Dela Rosa", "N", ["A", "P", "P", "P", "P", "P", "P", "P", "P", "P", "P", "P"]],
  ["Olivia Mercado", "O", ["P", "P", "A", "P", "P", "P", "P", "P", "P", "P", "P", "P"]],
  ["Parker Aquino", "P", ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P", "P", "L"]],
];

export function createDemoDataset(): AttendanceDataset {
  const students: AttendanceStudent[] = rows.map(([name, initials, marks], index) => ({
    id: `demo-${String(index + 1).padStart(3, "0")}`,
    name,
    program: "BS Information Technology",
    section: "41E3",
    sessions: dates.map((date, dateIndex) => ({ date, status: marks[dateIndex] as "P" | "A" | "L" })),
  }));

  return {
    metadata: {
      subjectTitle: "Elective 4 · Game Art Development",
      subjectCode: "ELE4",
      term: "First Semester · 2026–27",
      program: "BSIT",
      section: "41E3",
      scheduleDays: ["Wednesday", "Thursday", "Friday"],
      scheduleTimes: ["5:00 PM – 7:00 PM", "7:00 PM – 8:30 PM", "7:00 PM – 8:30 PM"],
    },
    sections: ["41E3"],
    dates,
    students,
    sourceName: "Illustrative demo dataset",
    importedAt: new Date().toISOString(),
  };
}
