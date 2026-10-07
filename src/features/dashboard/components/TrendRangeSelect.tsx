import { SelectField } from "../../../components/ui/SelectField";

export function TrendRangeSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <SelectField
    className="select-control range-select"
    label="Trend date range"
    visuallyHiddenLabel
    value={value}
    onChange={onChange}
    options={[{ value: "all", label: "All dates" }, { value: "recent", label: "Most recent 5" }]}
  />;
}
