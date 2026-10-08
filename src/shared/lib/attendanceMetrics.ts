import type { AttendanceDataset, AttendanceStudent, StudentMetrics } from "../types/attendance";

export function getStudentMetrics(student: AttendanceStudent): StudentMetrics {
  let present = 0;
  let absent = 0;
  let late = 0;
  let recorded = 0;
  let excused = 0;
  let consecutiveAbsences = 0;
  let currentAbsenceRun = 0;

  for (const session of [...student.sessions].sort((a, b) => a.date.localeCompare(b.date))) {
    if (!session.status) {
      currentAbsenceRun = 0;
      continue;
    }
    if (session.status === "E") {
      excused += 1;
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

  const expectedSessions = student.sessions.length;
  const coveredSessions = recorded + excused;
  const attendanceRateExact = recorded ? ((present + late) / recorded) * 100 : null;
  const riskReasons: string[] = [];
  if (absent >= 3) riskReasons.push(`${absent} absences in this period (review threshold: 3 or more)`);

  return {
    present, absent, late, excused, expected: recorded, recorded,
    attendanceRate: attendanceRateExact === null ? null : Math.round(attendanceRateExact), attendanceRateExact,
    consecutiveAbsences, riskReasons, expectedSessions,
    coveragePercent: expectedSessions ? Math.round((coveredSessions / expectedSessions) * 100) : 0,
    unrecorded: Math.max(0, expectedSessions - coveredSessions),
  };
}

export function getStatusForDate(student: AttendanceStudent, date: string) {
  return student.sessions.find((session) => session.date === date)?.status ?? "";
}

export function getDatasetSummary(dataset: AttendanceDataset) {
  const all = dataset.students.map(getStudentMetrics);
  const denominator = all.reduce((sum, student) => sum + student.recorded, 0);
  const numerator = all.reduce((sum, student) => sum + student.present + student.late, 0);
  const absent = all.reduce((sum, student) => sum + student.absent, 0);
  const late = all.reduce((sum, student) => sum + student.late, 0);
  const excused = all.reduce((sum, student) => sum + student.excused, 0);
  const expectedSessions = all.reduce((sum, student) => sum + student.expectedSessions, 0);
  const unrecorded = all.reduce((sum, student) => sum + student.unrecorded, 0);
  const covered = expectedSessions - unrecorded;

  return {
    students: dataset.students.length,
    sessions: dataset.dates.length,
    present: all.reduce((sum, student) => sum + student.present, 0),
    absent, late, excused, unrecorded,
    attendanceRate: denominator ? Math.round((numerator / denominator) * 100) : null,
    atRisk: all.filter((student) => student.riskReasons.length > 0).length,
    denominator,
    coveragePercent: expectedSessions ? Math.round((covered / expectedSessions) * 100) : 0,
  };
}

export function getDateTrend(dataset: AttendanceDataset) {
  return dataset.dates.flatMap((date) => {
    const marks = dataset.students.map((student) => getStatusForDate(student, date));
    const present = marks.filter((status) => status === "P").length;
    const absent = marks.filter((status) => status === "A").length;
    const late = marks.filter((status) => status === "L").length;
    const excused = marks.filter((status) => status === "E").length;
    const denominator = present + absent + late;
    const covered = denominator + excused;
    if (!denominator) return [];
    const rateExact = ((present + late) / denominator) * 100;
    const expected = dataset.expectedRosterByDate?.[date] ?? marks.length;
    return [{
      date,
      rate: Math.round(rateExact),
      rateExact,
      present, absent, late, excused,
      recorded: denominator,
      expected,
      unrecorded: Math.max(0, expected - covered),
      coveragePercent: expected ? Math.round((covered / expected) * 100) : 0,
    }];
  });
}

export function getWeekdayTrend(dataset: AttendanceDataset) {
  const groups = new Map<number, { day: string; sessions: number; present: number; absent: number; late: number; excused: number; unrecorded: number; expected: number }>();
  for (const point of getDateTrend(dataset)) {
    const weekday = new Date(`${point.date}T00:00:00Z`).getUTCDay();
    const current = groups.get(weekday) ?? {
      day: new Intl.DateTimeFormat("en", { weekday: "long", timeZone: "UTC" }).format(new Date(`${point.date}T00:00:00Z`)),
      sessions: 0, present: 0, absent: 0, late: 0, excused: 0, unrecorded: 0, expected: 0,
    };
    current.sessions += 1;
    current.present += point.present;
    current.absent += point.absent;
    current.late += point.late;
    current.excused += point.excused;
    current.unrecorded += point.unrecorded;
    current.expected += point.expected;
    groups.set(weekday, current);
  }
  return [...groups.entries()].sort(([a], [b]) => ((a + 6) % 7) - ((b + 6) % 7)).map(([, group]) => {
    const denominator = group.present + group.absent + group.late;
    const coverage = group.expected ? Math.round(((group.expected - group.unrecorded) / group.expected) * 100) : 0;
    return { ...group, rate: denominator ? Math.round(((group.present + group.late) / denominator) * 100) : 0, denominator, coverage };
  });
}

/**
 * Cautious class-level projection from a recency-weighted trend. Requires six usable sessions
 * with at least 60% roster coverage; the interval reflects sampling and residual variation.
 * It is a planning signal, not a validated forecast or an individual prediction.
 */
export function getAttendanceForecast(dataset: AttendanceDataset, horizon = 3) {
  const history = getDateTrend(dataset).filter((point) => point.coveragePercent >= 60 && point.recorded > 0);
  if (history.length < 6 || !horizon) return [];
  const sample = history.slice(-8);
  const weights = sample.map((_, index) => index + 1);
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  const xMean = weights.reduce((sum, weight, index) => sum + weight * index, 0) / weightSum;
  const yMean = sample.reduce((sum, point, index) => sum + weights[index] * point.rateExact, 0) / weightSum;
  const sxx = weights.reduce((sum, weight, index) => sum + weight * (index - xMean) ** 2, 0);
  const slope = sxx ? sample.reduce((sum, point, index) => sum + weights[index] * (index - xMean) * (point.rateExact - yMean), 0) / sxx : 0;
  const residualVariance = sample.reduce((sum, point, index) => sum + weights[index] * (point.rateExact - (yMean + slope * (index - xMean))) ** 2, 0) / Math.max(1, sample.length - 2);
  const lastDate = new Date(`${sample.at(-1)!.date}T00:00:00Z`);
  const gaps = sample.slice(1).map((point, index) => (Date.parse(`${point.date}T00:00:00Z`) - Date.parse(`${sample[index].date}T00:00:00Z`)) / 86_400_000).filter((gap) => gap > 0);
  const sortedGaps = [...gaps].sort((a, b) => a - b);
  const cadenceDays = sortedGaps.length ? sortedGaps[Math.floor(sortedGaps.length / 2)] : 7;
  const xEnd = sample.length - 1;

  return Array.from({ length: Math.min(horizon, 8) }, (_, offset) => {
    const step = offset + 1;
    const x = xEnd + step;
    const projectedRaw = yMean + slope * (x - xMean);
    const projectedRate = Math.max(0, Math.min(100, Math.round(projectedRaw)));
    const marks = sample.at(-1)!.recorded;
    const samplingError = Math.sqrt(Math.max(0, (projectedRate / 100) * (1 - projectedRate / 100) / marks)) * 100;
    const predictionError = 1.645 * Math.sqrt(residualVariance * (1 + 1 / sample.length + ((x - xMean) ** 2 / Math.max(1, sxx))) + samplingError ** 2);
    const date = new Date(lastDate);
    date.setUTCDate(date.getUTCDate() + Math.round(cadenceDays * step));
    return {
      date: date.toISOString().slice(0, 10), projectedRate,
      lowerBound: Math.max(0, Math.floor(projectedRaw - predictionError)),
      upperBound: Math.min(100, Math.ceil(projectedRaw + predictionError)),
      sessionsUsed: sample.length,
      meanCoverage: Math.round(sample.reduce((sum, point) => sum + point.coveragePercent, 0) / sample.length),
    };
  });
}
