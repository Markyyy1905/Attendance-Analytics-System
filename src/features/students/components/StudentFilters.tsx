import { SelectField } from "../../../components/ui/SelectField";
import type { CoverageFilter, RateFilter, ReviewFilter } from "../../../shared/lib/attendanceFilters";

export function StudentStatusFilter({ value, onChange }: { value: ReviewFilter; onChange: (value: ReviewFilter) => void }) {
  return <SelectField
    className="select-control"
    label="Filter students by status"
    visuallyHiddenLabel
    value={value}
    onChange={(next) => onChange(next as ReviewFilter)}
    options={[{ value: "all", label: "Any review status" }, { value: "needs-review", label: "Needs review" }, { value: "on-track", label: "No active flags" }]}
  />;
}

export function StudentRateFilter({ value, onChange }: { value: RateFilter; onChange: (value: RateFilter) => void }) {
  return <SelectField className="select-control" label="Filter by attendance rate" visuallyHiddenLabel value={value} onChange={(next) => onChange(next as RateFilter)} options={[{ value: "all", label: "Any attendance rate" }, { value: "below-75", label: "Below 75%" }, { value: "75-89", label: "75% to 89%" }, { value: "90-100", label: "90% to 100%" }, { value: "no-rate", label: "No eligible rate" }]} />;
}

export function StudentCoverageFilter({ value, onChange }: { value: CoverageFilter; onChange: (value: CoverageFilter) => void }) {
  return <SelectField className="select-control" label="Filter by record completeness" visuallyHiddenLabel value={value} onChange={(next) => onChange(next as CoverageFilter)} options={[{ value: "all", label: "Any completeness" }, { value: "complete", label: "Complete records" }, { value: "missing", label: "Has unrecorded sessions" }]} />;
}

export function StudentSectionFilter({ sections, value, onChange }: { sections: string[]; value: string; onChange: (value: string) => void }) {
  return <SelectField
    className="select-control"
    label="Filter students by section"
    visuallyHiddenLabel
    value={value}
    onChange={onChange}
    options={[{ value: "all", label: "All sections" }, ...sections.map((section) => ({ value: section, label: section }))]}
  />;
}
