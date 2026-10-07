import { SelectField } from "../../../components/ui/SelectField";

export function ClassTermFilter({ terms, value, onChange }: { terms: string[]; value: string; onChange: (value: string) => void }) {
  return <SelectField
    className="class-term-filter"
    label="Term"
    value={value}
    onChange={onChange}
    options={[{ value: "all", label: "All terms" }, ...terms.map((term) => ({ value: term, label: term }))]}
  />;
}
