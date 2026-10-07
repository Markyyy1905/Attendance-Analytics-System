import { SelectField } from "../../../components/ui/SelectField";

export function AnalyticsSectionSelect({ sections, value, onChange }: { sections: string[]; value: string; onChange: (value: string) => void }) {
  return <SelectField label="Class / section" value={value} onChange={onChange} options={[{ value: "all", label: "All sections" }, ...sections.map((section) => ({ value: section, label: section }))]} />;
}

export function AnalyticsDateRangeSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <SelectField label="Date range" value={value} onChange={onChange} options={[{ value: "all", label: "All dates" }, { value: "recent10", label: "Recent 10 sessions" }, { value: "recent5", label: "Recent 5 sessions" }]} />;
}

export function AnalyticsStudentSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <label>Student search<input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Student name" /></label>;
}

export function AnalyticsFilters({
  sections,
  section,
  onSectionChange,
  dateRange,
  onDateRangeChange,
  student,
  onStudentChange,
}: {
  sections: string[];
  section: string;
  onSectionChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  student: string;
  onStudentChange: (value: string) => void;
}) {
  return <div className="analytics-filters" aria-label="Analytics filters">
    <AnalyticsSectionSelect sections={sections} value={section} onChange={onSectionChange} />
    <AnalyticsDateRangeSelect value={dateRange} onChange={onDateRangeChange} />
    <AnalyticsStudentSearch value={student} onChange={onStudentChange} />
  </div>;
}
