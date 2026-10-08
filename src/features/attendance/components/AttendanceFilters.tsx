import { SlidersHorizontal } from "lucide-react";
import { SelectField } from "../../../components/ui/SelectField";
import type { CoverageFilter, PeriodFilter, ReviewFilter } from "../../../shared/lib/attendanceFilters";

export function AttendanceStatusFilter({ value, onChange }: { value: ReviewFilter; onChange: (value: ReviewFilter) => void }) {
  return <SelectField
    className="select-control attendance-filter"
    label="Filter students"
    visuallyHiddenLabel
    leading={<SlidersHorizontal size={15} />}
    value={value}
    onChange={(next) => onChange(next as ReviewFilter)}
    options={[{ value: "all", label: "Any review status" }, { value: "needs-review", label: "Needs review" }, { value: "on-track", label: "No active flags" }]}
  />;
}

export function AttendancePeriodFilter({ value, onChange }: { value: PeriodFilter; onChange: (value: PeriodFilter) => void }) {
  return <SelectField className="select-control attendance-filter" label="Reporting period" visuallyHiddenLabel value={value} onChange={(next) => onChange(next as PeriodFilter)} options={[{ value: "all", label: "Entire class history" }, { value: "last-30-days", label: "Last 30 days" }, { value: "recent-10", label: "Latest 10 sessions" }, { value: "recent-5", label: "Latest 5 sessions" }]} />;
}

export function AttendanceCoverageFilter({ value, onChange }: { value: CoverageFilter; onChange: (value: CoverageFilter) => void }) {
  return <SelectField className="select-control attendance-filter" label="Record completeness" visuallyHiddenLabel value={value} onChange={(next) => onChange(next as CoverageFilter)} options={[{ value: "all", label: "Any completeness" }, { value: "complete", label: "Complete records" }, { value: "missing", label: "Has unrecorded sessions" }]} />;
}

export function AttendanceSectionFilter({ sections, value, onChange }: { sections: string[]; value: string; onChange: (value: string) => void }) {
  return <SelectField
    className="select-control attendance-filter"
    label="Filter by section"
    visuallyHiddenLabel
    value={value}
    onChange={onChange}
    options={[{ value: "all", label: "All sections" }, ...sections.map((section) => ({ value: section, label: section }))]}
  />;
}
