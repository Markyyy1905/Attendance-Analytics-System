import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { TeachingClass } from "../../app/providers/AttendanceDataProvider";

function getWorkspaceInitials(value: string) {
  const words = value.trim().split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (words.length > 1) return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  const compact = words[0] ?? "CL";
  return compact.replace(/\d+.*$/, "").slice(0, 2).toUpperCase() || compact.slice(0, 2).toUpperCase();
}

function ClassSwitcherOption({ item, active, onSelect }: { item: TeachingClass; active: boolean; onSelect: (classId: string) => void }) {
  return <button
    type="button"
    className={`workspace-option ${active ? "workspace-option-active" : ""}`}
    role="option"
    aria-selected={active}
    onClick={() => onSelect(item.id)}
  >
    <span><strong>{item.subject}</strong><small>{item.section} · {item.term}</small></span>
    {active && <Check size={15} aria-hidden="true" />}
  </button>;
}

export function ClassSwitcher({
  classes,
  workspaceCode,
  activeClassId,
  isLoading,
  onSelect,
}: {
  classes: TeachingClass[];
  workspaceCode: string;
  activeClassId: string;
  isLoading: boolean;
  onSelect: (classId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const activeClass = classes.find((item) => item.id === activeClassId);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!switcherRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function selectClass(classId: string) {
    setOpen(false);
    onSelect(classId);
  }

  return <div className={`workspace-switcher ${open ? "workspace-switcher-open" : ""}`} ref={switcherRef}>
    <div className="workspace-avatar" aria-label={`${workspaceCode || "Class"} workspace`} title={workspaceCode || "Class workspace"}>{getWorkspaceInitials(workspaceCode)}</div>
    <div className="workspace-copy">
      <span>Teaching workspace · {classes.length} assigned</span>
      <button className="workspace-trigger" type="button" disabled={!classes.length || isLoading} aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((current) => !current)}>
        <span>{isLoading ? "Loading class…" : activeClass ? `${activeClass.subject} · ${activeClass.section}` : "No classes assigned"}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      {open && <div className="workspace-options" role="listbox" aria-label="Switch active class">
        {classes.map((item) => <ClassSwitcherOption key={item.id} item={item} active={item.id === activeClassId} onSelect={selectClass} />)}
      </div>}
    </div>
  </div>;
}
