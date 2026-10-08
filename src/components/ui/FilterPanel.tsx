import type { ReactNode } from "react";
import "./FilterPanel.css";

export function FilterPanel({ children }: { children: ReactNode }) {
  return <details className="filter-panel"><summary>Filters</summary><div className="filter-panel-fields">{children}</div></details>;
}
