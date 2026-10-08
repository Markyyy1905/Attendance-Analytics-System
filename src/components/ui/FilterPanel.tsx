import type { ReactNode } from "react";
import "./FilterPanel.css";

export function FilterPanel({ children, activeCount = 0 }: { children: ReactNode; activeCount?: number }) {
  return <details className="filter-panel"><summary>Filters{activeCount > 0 ? ` (${activeCount} active)` : ""}</summary><div className="filter-panel-fields">{children}</div></details>;
}
