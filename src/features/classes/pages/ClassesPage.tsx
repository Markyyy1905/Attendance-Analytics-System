import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, BookOpen, CalendarDays, FileUp, Search, UserPlus, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../components/ui/PageHeader";
import { useAttendanceData } from "../../../app/providers/AttendanceDataProvider";
import "./ClassesPage.css";

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "No import yet";
}

export function ClassesPage() {
  const { classes, teachers, activeTeacherId, activeClassId, selectClass, selectTeacher, assignClass, createTeacher, user, isLoading, dataError } = useAttendanceData();
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("all");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const terms = [...new Set(classes.map((item) => item.term))].sort().reverse();
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return classes.filter((item) => (term === "all" || item.term === term) &&
      (!query || `${item.subject} ${item.class_code} ${item.section} ${item.grade_level}`.toLocaleLowerCase().includes(query)));
  }, [classes, search, term]);

  async function handleCreateTeacher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setError(""); setSaving(true);
    try {
      await createTeacher(String(form.get("name") || ""), String(form.get("email") || ""), String(form.get("password") || ""), String(form.get("role") || "faculty"));
      formElement.reset();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not create teacher."); }
    finally { setSaving(false); }
  }

  async function toggleAssignment(classId: string, assigned: boolean) {
    setError(""); setSaving(true);
    try { await assignClass(classId, !assigned); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update this class assignment."); }
    finally { setSaving(false); }
  }

  return <main className="page-classes">
    <PageHeader title="My classes" description="Organize teaching assignments and move between class sections without mixing their attendance records." actions={<Link className="button button-primary" to="/import"><FileUp size={16} /> Add attendance data</Link>} />
    <div className="teacher-management-row">
      <div><span>Signed in as</span><strong>{user?.display_name} · {user?.school_name}</strong></div>{user?.roles.includes("administrator")&&<label className="class-term-filter"><span>Teacher workspace</span><select value={activeTeacherId} onChange={(event)=>void selectTeacher(event.target.value)}>{teachers.map((teacher)=><option key={teacher.id} value={teacher.id}>{teacher.display_name}</option>)}</select></label>}
      {user?.roles.includes("administrator")&&<details className="add-teacher-details"><summary><UserPlus size={15} /> Add teacher profile</summary><form onSubmit={(event) => void handleCreateTeacher(event)}><label>Teacher name<input name="name" autoComplete="name" required minLength={2} maxLength={100} /></label><label>Email address<input name="email" type="email" autoComplete="email" required /></label><label>Role<select name="role"><option value="faculty">Faculty</option><option value="coordinator">Coordinator</option><option value="department_head">Department head</option><option value="administrator">Administrator</option></select></label><label>Temporary password<input name="password" type="password" minLength={12} autoComplete="new-password" required /></label><button className="button button-primary" disabled={saving}>{saving ? "Saving…" : "Create profile"}</button></form></details>}
    </div>
    {error && <p className="class-management-error" role="alert">{error}</p>}
    <section className="class-workspace-toolbar" aria-label="Filter classes">
      <label className="class-search"><Search size={16} /><span className="sr-only">Search classes</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search subject, code, or section" /></label>
      <label className="class-term-filter"><span>Term</span><select value={term} onChange={(event) => setTerm(event.target.value)}><option value="all">All terms</option>{terms.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <span className="class-result-count">{classes.filter((item) => item.assigned).length} assigned · {filtered.length} shown</span>
    </section>

    {isLoading ? <div className="class-empty"><strong>Loading your classes</strong><span>Connecting to your saved attendance workspace.</span></div> : dataError && !classes.length ? <div className="class-empty" role="alert"><strong>Classes could not be loaded</strong><span>{dataError}</span></div> : !classes.length ? <div className="class-empty"><BookOpen size={23} /><strong>No classes in this workspace yet</strong><span>Import a class attendance CSV. Each section in the file will be saved as its own class workspace.</span><Link className="button button-primary" to="/import"><FileUp size={15} /> Import a class</Link></div> : !filtered.length ? <div className="class-empty"><Search size={22} /><strong>No classes match those filters</strong><span>Try another class name or term.</span></div> : <div className="class-table-wrap"><table className="class-table"><thead><tr><th>Class</th><th>Term</th><th>Students</th><th>Sessions</th><th>Last import</th><th>Assignment</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} className={item.id === activeClassId ? "class-row-active" : ""}>
      <td><div className="class-name"><span className="class-icon"><BookOpen size={17} /></span><span><strong>{item.subject}</strong><small>{item.class_code} · {item.section} · {item.grade_level}</small></span></div></td>
      <td>{item.term}</td>
      <td><span className="class-count"><UsersRound size={14} />{item.student_count}</span></td>
      <td><span className="class-count"><CalendarDays size={14} />{item.session_count}</span></td>
      <td><span className="class-date">{formatDate(item.uploaded_at)}</span><small className="class-source">{item.source_filename}</small></td>
      <td><div className="class-row-actions">{item.assigned ? <button className="button button-secondary class-open" disabled={saving} onClick={() => void selectClass(item.id)}>{item.id === activeClassId ? "Active class" : "Open class"}{item.id !== activeClassId && <ArrowRight size={14} />}</button> : <button className="button button-secondary class-open" disabled={saving} onClick={() => void toggleAssignment(item.id, false)}>Assign to teacher</button>}{item.assigned && <button className="class-unassign" disabled={saving} onClick={() => void toggleAssignment(item.id, true)}>Remove</button>}</div></td>
    </tr>)}</tbody></table></div>}
    <p className="class-workspace-note">Each imported section has its own roster, attendance history, trend, and review flags. Teacher assignments organize this local workspace; school roles and class permissions are enforced by the signed-in account.</p>
  </main>;
}
