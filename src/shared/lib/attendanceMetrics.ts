import type { AttendanceDataset, AttendanceStudent, StudentMetrics } from "../types/attendance";

export function getStudentMetrics(student: AttendanceStudent): StudentMetrics {
  let present = 0;
  let absent = 0;
  let late = 0;
  let recorded = 0;
  let consecutiveAbsences = 0;
  let currentAbsenceRun = 0;

  for (const session of student.sessions) {
    if (!session.status) {
      currentAbsenceRun = 0;
      continue;
    }
    recorded += 1;
    if (session.status === "P") {
      present += 1;
      currentAbsenceRun = 0;
    } else if (session.status === "A") {
      absent += 1;
      currentAbsenceRun += 1;
      consecutiveAbsences = Math.max(consecutiveAbsences, currentAbsenceRun);
    } else {
      late += 1;
      currentAbsenceRun = 0;
    }
  }

  // The supplied brief does not define its formula. This demo uses P / all recorded marks;
  // late arrivals remain visible as a separate count.
  const attendanceRate = recorded ? Math.round((present / recorded) * 100) : 0;
  const riskReasons: string[] = [];
  if (recorded && attendanceRate < 75) riskReasons.push("Attendance below 75%");
  if (consecutiveAbsences >= 5) riskReasons.push("5+ consecutive absences");
  if (absent > 8) riskReasons.push("More than 8 absences");

  return { present, absent, late, recorded, attendanceRate, consecutiveAbsences, riskReasons };
}

export function getStatusForDate(student: AttendanceStudent, date: string) {
  return student.sessions.find((session) => session.date === date)?.status ?? "";
}

export function getDatasetSummary(dataset: AttendanceDataset) {
  const all = dataset.students.map(getStudentMetrics);
  const totalMarks = all.reduce((sum, student) => sum + student.recorded, 0);
  const presentMarks = all.reduce((sum, student) => sum + student.present, 0);
  const absent = all.reduce((sum, student) => sum + student.absent, 0);
  const late = all.reduce((sum, student) => sum + student.late, 0);

  return {
    students: dataset.students.length,
    sessions: dataset.dates.length,
    present: presentMarks,
    absent,
    late,
    attendanceRate: totalMarks ? Math.round((presentMarks / totalMarks) * 100) : 0,
    atRisk: all.filter((student) => student.riskReasons.length > 0).length,
  };
}

export function getDateTrend(dataset: AttendanceDataset) {
  return dataset.dates.map((date, index) => {
    const marks = dataset.students
      .map((student) => getStatusForDate(student, date))
      .filter((status): status is "P" | "A" | "L" => Boolean(status));
    const present = marks.filter((status) => status === "P").length;
    return {
      date,
      rate: marks.length ? Math.round((present / marks.length) * 100) : 0,
      present,
      absent: marks.filter((status) => status === "A").length,
      late: marks.filter((status) => status === "L").length,
      recorded: marks.length,
    };
  });
}
