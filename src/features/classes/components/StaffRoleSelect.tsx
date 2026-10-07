import { SelectField } from "../../../components/ui/SelectField";

export function StaffRoleSelect() {
  return <SelectField
    className="staff-role-field"
    label="Role"
    name="role"
    defaultValue="faculty"
    options={[{ value: "faculty", label: "Faculty" }, { value: "coordinator", label: "Coordinator" }, { value: "department_head", label: "Department head" }, { value: "administrator", label: "Administrator" }]}
  />;
}
