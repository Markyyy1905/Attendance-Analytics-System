import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

type Option = { label: string; value: string };
export function Dropdown({ label, options, value, onChange, icon }: { label: string; options: Option[]; value?: string; onChange?: (value: string) => void; icon?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value ?? options[0]?.value);
  const ref = useRef<HTMLDivElement>(null);
  const activeValue = value ?? internalValue;
  const selected = options.find((option) => option.value === activeValue)?.label ?? label;
  useEffect(() => { const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); }; document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close); }, []);
  return <div className="dropdown" ref={ref}><button className="filter-control" type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>{icon}{selected}<ChevronDown size={14} /></button>{open && <div className="dropdown-menu" role="listbox">{options.map((option) => <button type="button" role="option" aria-selected={option.value === activeValue} className="dropdown-option" key={option.value} onClick={() => { setInternalValue(option.value); onChange?.(option.value); setOpen(false); }}>{option.label}{option.value === activeValue && <Check size={14} />}</button>)}</div>}</div>;
}
