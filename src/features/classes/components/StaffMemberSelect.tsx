import { SelectField } from "../../../components/ui/SelectField";
import type { TeacherAccount } from "../../../app/providers/AttendanceDataProvider";

export function StaffMemberSelect({ staff, value, onChange }: { staff: TeacherAccount[]; value: string; onChange: (value: string) => void }) {
  return <SelectField
    className="staff-select-label"
    label="Staff member"
    value={value}
    onChange={onChange}
    disabled={!staff.length}
    options={staff.map((person) => ({ value: person.id, label: `${person.display_name} (${person.email})` }))}
  />;
}
