import { SelectField } from "../ui/SelectField";
import type { TeachingClass } from "../../app/providers/AttendanceDataProvider";

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
  return <div className="workspace-switcher">
    <div className="workspace-avatar">{workspaceCode.slice(0, 2) || "CL"}</div>
    <div className="workspace-copy">
      <span>Teaching workspace · {classes.length} assigned</span>
      <SelectField
        label="Switch active class"
        visuallyHiddenLabel
        value={activeClassId}
        disabled={!classes.length || isLoading}
        options={classes.length
          ? classes.map((item) => ({ value: item.id, label: `${item.subject} · ${item.section} · ${item.term}` }))
          : [{ value: "", label: "No classes assigned" }]}
        onChange={onSelect}
      />
    </div>
  </div>;
}
