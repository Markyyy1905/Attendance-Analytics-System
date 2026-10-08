import { FilterCheckboxGroup } from "../../../components/ui/FilterCheckboxGroup";
import { FilterPanel } from "../../../components/ui/FilterPanel";
import type { CoverageFilter, PeriodSelection, ReviewFilter } from "../../../shared/lib/attendanceFilters";

export function AnalyticsFilters({
  dateRanges,
  onDateRangesChange,
  student,
  onStudentChange,
  reviews,
  onReviewsChange,
  coverage,
  onCoverageChange,
  onReset,
}: {
  dateRanges: PeriodSelection[];
  onDateRangesChange: (values: PeriodSelection[]) => void;
  student: string;
  onStudentChange: (value: string) => void;
  reviews: ReviewFilter[];
  onReviewsChange: (values: ReviewFilter[]) => void;
  coverage: CoverageFilter[];
  onCoverageChange: (values: CoverageFilter[]) => void;
  onReset: () => void;
}) {
  const activeCount = dateRanges.length + reviews.length + coverage.length + Number(Boolean(student.trim()));

  return (
    <div className="analytics-filters" aria-label="Analytics filters">
      <FilterPanel activeCount={activeCount}>
        <FilterCheckboxGroup label="Reporting period" options={[{ value: "last-30-days", label: "Last 30 days" }, { value: "recent-10", label: "Latest 10 sessions" }, { value: "recent-5", label: "Latest 5 sessions" }]} selected={dateRanges} onChange={onDateRangesChange} />
        <FilterCheckboxGroup label="Review status" options={[{ value: "needs-review", label: "Needs review" }, { value: "on-track", label: "No active flags" }]} selected={reviews} onChange={onReviewsChange} />
        <FilterCheckboxGroup label="Record completeness" options={[{ value: "complete", label: "Complete records" }, { value: "missing", label: "Has unrecorded sessions" }]} selected={coverage} onChange={onCoverageChange} />
        <label className="analytics-student-filter">Student name<input value={student} onChange={(event) => onStudentChange(event.target.value)} placeholder="Search by student name" /></label>
        <button className="button button-secondary analytics-filter-reset" type="button" onClick={onReset} disabled={activeCount === 0 && !student}>Clear filters</button>
      </FilterPanel>
    </div>
  );
}
