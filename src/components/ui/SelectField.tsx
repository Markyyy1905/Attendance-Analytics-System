import type { ReactNode } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  options: SelectOption[];
  className?: string;
  value?: string;
  defaultValue?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  visuallyHiddenLabel?: boolean;
  leading?: ReactNode;
  onChange?: (value: string) => void;
}

export function SelectField({
  label,
  options,
  className,
  value,
  defaultValue,
  name,
  disabled,
  required,
  visuallyHiddenLabel,
  leading,
  onChange,
}: SelectFieldProps) {
  const selection = value === undefined ? { defaultValue } : { value };

  return (
    <label className={className}>
      {leading}
      <span className={visuallyHiddenLabel ? "sr-only" : undefined}>{label}</span>
      <select
        {...selection}
        name={name}
        disabled={disabled}
        required={required}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
