import { SlidersHorizontal } from "lucide-react";
import { SelectField } from "../../../components/ui/SelectField";

export function AttendanceStatusFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <SelectField
    className="select-control attendance-filter"
    label="Filter students"
    visuallyHiddenLabel
    leading={<SlidersHorizontal size={15} />}
    value={value}
    onChange={onChange}
    options={[{ value: "all", label: "All students" }, { value: "risk", label: "Needs a check-in" }, { value: "clear", label: "On track" }]}
  />;
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
