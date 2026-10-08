import type { StudentMetrics } from "../types/attendance";

export type ReviewFilter = "all" | "needs-review" | "on-track";
export type CoverageFilter = "all" | "complete" | "missing";
export type RateFilter = "all" | "below-75" | "75-89" | "90-100" | "no-rate";
export type PeriodFilter = "all" | "last-30-days" | "recent-10" | "recent-5";
export type PeriodSelection = Exclude<PeriodFilter, "all">;

export function matchesReviewFilter(metrics: StudentMetrics, filter: ReviewFilter) {
  if (filter === "all") return true;
  if (filter === "needs-review") return metrics.riskReasons.length > 0;
  if (filter === "on-track") return metrics.riskReasons.length === 0;
  return false;
}

export function matchesCoverageFilter(metrics: StudentMetrics, filter: CoverageFilter) {
  return filter === "all" || (filter === "complete" ? metrics.unrecorded === 0 : metrics.unrecorded > 0);
}

export function matchesRateFilter(metrics: StudentMetrics, filter: RateFilter) {
  const rate = metrics.attendanceRateExact;
  if (filter === "all") return true;
  if (filter === "no-rate") return rate === null;
  if (rate === null) return false;
  if (filter === "below-75") return rate < 75;
  if (filter === "75-89") return rate >= 75 && rate < 90;
  return rate >= 90;
}

export function filterDatesByPeriod(dates: string[], filter: PeriodFilter) {
  if (filter === "recent-5") return dates.slice(-5);
  if (filter === "recent-10") return dates.slice(-10);
  if (filter === "last-30-days" && dates.length) {
    const latest = new Date(dates[dates.length - 1] + "T00:00:00Z");
    const cutoff = new Date(latest);
    cutoff.setUTCDate(cutoff.getUTCDate() - 29);
    const cutoffKey = cutoff.toISOString().slice(0, 10);
    return dates.filter((date) => date >= cutoffKey);
  }
  return dates;
}

export function filterDatesByPeriods(dates: string[], filters: PeriodSelection[]) {
  if (!filters.length) return dates;
  const selectedDates = new Set(filters.flatMap((filter) => filterDatesByPeriod(dates, filter)));
  return dates.filter((date) => selectedDates.has(date));
}

export const periodFilterLabel = (filter: PeriodFilter) => ({
  all: "Entire class history",
  "last-30-days": "Last 30 days",
  "recent-10": "Latest 10 sessions",
  "recent-5": "Latest 5 sessions",
})[filter];

export function periodFiltersLabel(filters: PeriodSelection[]) {
  return filters.length ? filters.map(periodFilterLabel).join(" + ") : periodFilterLabel("all");
}
