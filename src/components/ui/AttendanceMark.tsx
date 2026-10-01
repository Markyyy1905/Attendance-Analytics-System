import type { AttendanceCode } from "../../shared/types/attendance";

export function AttendanceMark({ status }: { status: AttendanceCode | "" }) {
  if (!status) return <span className="attendance-mark attendance-mark-empty" aria-label="Not recorded">—</span>;
  const label = status === "P" ? "Present" : status === "A" ? "Absent" : "Late";
  return <span className={`attendance-mark mark-${status.toLowerCase()}`} aria-label={label} title={label}>{status}</span>;
}

export function RiskLabel({ reasons }: { reasons: string[] }) {
  if (!reasons.length) return <span className="risk-label risk-low"><span />On track</span>;
  return <span className="risk-label risk-high"><span />Needs review</span>;
}
