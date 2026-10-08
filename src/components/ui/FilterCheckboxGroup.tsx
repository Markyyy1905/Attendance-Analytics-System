export interface FilterCheckboxOption<T extends string = string> {
  value: T;
  label: string;
}

export function FilterCheckboxGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: FilterCheckboxOption<T>[];
  selected: T[];
  onChange: (values: T[]) => void;
}) {
  function toggle(value: T, checked: boolean) {
    onChange(checked ? [...selected, value] : selected.filter((item) => item !== value));
  }

  return (
    <fieldset className="filter-checkbox-group">
      <legend>{label}</legend>
      {options.map((option) => (
        <label className="filter-checkbox-option" key={option.value}>
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={(event) => toggle(option.value, event.target.checked)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
