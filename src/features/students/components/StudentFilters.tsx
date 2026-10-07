import { SelectField } from "../../../components/ui/SelectField";

export function StudentStatusFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <SelectField
    className="select-control"
    label="Filter students by status"
    visuallyHiddenLabel
    value={value}
    onChange={onChange}
    options={[{ value: "all", label: "All students" }, { value: "risk", label: "Needs a check-in" }, { value: "clear", label: "On track" }]}
  />;
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
