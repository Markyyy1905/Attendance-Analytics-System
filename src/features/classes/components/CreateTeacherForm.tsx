import { useState, type FormEvent } from "react";
import { UserPlus } from "lucide-react";
import { StaffRoleSelect } from "./StaffRoleSelect";
import "./CreateTeacherForm.css";

export function CreateTeacherForm({ onCreate }: { onCreate: (name: string, email: string, password: string, role: string) => Promise<void> }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setSaving(true);
    setError("");
    setCreated(false);
    try {
      await onCreate(String(values.get("name") || ""), String(values.get("email") || ""), String(values.get("password") || ""), String(values.get("role") || "faculty"));
      form.reset();
      setCreated(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create the staff account.");
    } finally {
      setSaving(false);
    }
  }

  return <section className="panel staff-create-panel">
    <div className="panel-heading"><div><h2>Create a staff account</h2><p>Add an authorized colleague to this school workspace.</p></div></div>
    {error && <p className="staff-form-error" role="alert">{error}</p>}
    {created && <p className="staff-form-success" role="status">Staff account created. The new account is ready to receive class access.</p>}
    <form className="staff-create-form" onSubmit={(event) => void submit(event)}>
      <label>Staff name<input name="name" autoComplete="name" required minLength={2} maxLength={100} /></label>
      <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
      <StaffRoleSelect />
      <label>Temporary password<input name="password" type="password" minLength={12} autoComplete="new-password" required /><small>Use at least 12 characters. Share it securely with the staff member.</small></label>
      <button className="button button-primary" type="submit" disabled={saving}><UserPlus size={16} />{saving ? "Creating account..." : "Create staff account"}</button>
    </form>
  </section>;
}
