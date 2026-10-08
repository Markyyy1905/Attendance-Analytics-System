import { FilterPanel } from "../../../components/ui/FilterPanel";
import { SelectField } from "../../../components/ui/SelectField";
import type { CoverageFilter, PeriodFilter, ReviewFilter } from "../../../shared/lib/attendanceFilters";

export function AnalyticsSectionSelect({ sections, value, onChange }: { sections: string[]; value: string; onChange: (value: string) => void }) {
  return <SelectField label="Class / section" value={value} onChange={onChange} options={[{ value: "all", label: "All sections" }, ...sections.map((section) => ({ value: section, label: section }))]} />;
}

export function AnalyticsDateRangeSelect({ value, onChange }: { value: PeriodFilter; onChange: (value: PeriodFilter) => void }) {
  return <SelectField label="Reporting period" value={value} onChange={(next) => onChange(next as PeriodFilter)} options={[{ value: "all", label: "Entire class history" }, { value: "last-30-days", label: "Last 30 days" }, { value: "recent-10", label: "Latest 10 sessions" }, { value: "recent-5", label: "Latest 5 sessions" }]} />;
}

export function AnalyticsStudentSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <label>Student<input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search by student name" /></label>;
}

export function AnalyticsReviewFilter({ value, onChange }: { value: ReviewFilter; onChange: (value: ReviewFilter) => void }) {
  return <SelectField label="Review status" value={value} onChange={(next) => onChange(next as ReviewFilter)} options={[{ value: "all", label: "Any review status" }, { value: "needs-review", label: "Needs review" }, { value: "on-track", label: "No active flags" }]} />;
}

export function AnalyticsCoverageFilter({ value, onChange }: { value: CoverageFilter; onChange: (value: CoverageFilter) => void }) {
  return <SelectField label="Record completeness" value={value} onChange={(next) => onChange(next as CoverageFilter)} options={[{ value: "all", label: "Any completeness" }, { value: "complete", label: "Complete records" }, { value: "missing", label: "Has unrecorded sessions" }]} />;
}

export function AnalyticsFilters({
  dateRange,
  onDateRangeChange,
  student,
  onStudentChange,
  review,
  onReviewChange,
  coverage,
  onCoverageChange,
  onReset,
}: {
  dateRange: PeriodFilter;
  onDateRangeChange: (value: PeriodFilter) => void;
  student: string;
  onStudentChange: (value: string) => void;
  review: ReviewFilter;
  onReviewChange: (value: ReviewFilter) => void;
  coverage: CoverageFilter;
  onCoverageChange: (value: CoverageFilter) => void;
  onReset: () => void;
}) {
  return <div className="analytics-filters" aria-label="Analytics filters">
    <FilterPanel><AnalyticsDateRangeSelect value={dateRange} onChange={onDateRangeChange} />
    <AnalyticsStudentSearch value={student} onChange={onStudentChange} />
    <AnalyticsReviewFilter value={review} onChange={onReviewChange} />
    <AnalyticsCoverageFilter value={coverage} onChange={onCoverageChange} />
    <button className="button button-secondary analytics-filter-reset" type="button" onClick={onReset} disabled={dateRange === "all" && !student && review === "all" && coverage === "all"}>Clear filters</button></FilterPanel>
  </div>;
}
