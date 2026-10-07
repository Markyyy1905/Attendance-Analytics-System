import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";

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

export function SelectField({ label, options, className = "", value, defaultValue, name, disabled, required, visuallyHiddenLabel, leading, onChange }: SelectFieldProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value ?? "");
  const selectedValue = value ?? internalValue;
  const selectedOption = options.find((option) => option.value === selectedValue) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  useEffect(() => {
    if (value !== undefined) return;
    const form = rootRef.current?.closest("form");
    const resetValue = () => setInternalValue(defaultValue ?? options[0]?.value ?? "");
    form?.addEventListener("reset", resetValue);
    return () => form?.removeEventListener("reset", resetValue);
  }, [defaultValue, options, value]);

  function choose(nextValue: string) {
    if (value === undefined) setInternalValue(nextValue);
    onChange?.(nextValue);
    setOpen(false);
  }

  function focusOption(index: number) {
    const items = rootRef.current?.querySelectorAll<HTMLButtonElement>(".select-field-option");
    items?.[Math.max(0, Math.min(index, (items?.length ?? 1) - 1))]?.focus();
  }

  function openAndFocusSelected() {
    if (disabled || !options.length) return;
    setOpen(true);
    const selectedIndex = Math.max(0, options.findIndex((option) => option.value === selectedValue));
    requestAnimationFrame(() => focusOption(selectedIndex));
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openAndFocusSelected();
    }
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowDown") { event.preventDefault(); focusOption(index + 1); }
    if (event.key === "ArrowUp") { event.preventDefault(); focusOption(index - 1); }
    if (event.key === "Home") { event.preventDefault(); focusOption(0); }
    if (event.key === "End") { event.preventDefault(); focusOption(options.length - 1); }
  }

  return <div
    className={`select-field ${className}`}
    ref={rootRef}
    onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    }}
  >
    <span className={visuallyHiddenLabel ? "sr-only" : "select-field-label"}>{label}</span>
    {name && <input type="hidden" name={name} value={selectedValue} required={required} />}
    <button ref={triggerRef} className="select-field-trigger" type="button" disabled={disabled || !options.length} aria-label={label} aria-expanded={open} aria-controls={listId} aria-haspopup="listbox" onClick={() => setOpen((current) => !current)} onKeyDown={handleTriggerKeyDown}>
      {leading}<span>{selectedOption?.label || "No options available"}</span><ChevronDown size={15} aria-hidden="true" />
    </button>
    {open && <div className="select-field-options" id={listId} role="listbox" aria-label={label}>
      {options.map((option, index) => <button className={`select-field-option ${option.value === selectedValue ? "select-field-option-active" : ""}`} type="button" role="option" aria-selected={option.value === selectedValue} key={option.value} onClick={() => choose(option.value)} onKeyDown={(event) => handleOptionKeyDown(event, index)}>
        <span>{option.label}</span>{option.value === selectedValue && <Check size={15} aria-hidden="true" />}
      </button>)}
    </div>}
  </div>;
}
