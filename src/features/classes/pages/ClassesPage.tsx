import { DeleteClassButton } from "../components/DeleteClassButton";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, FileUp, Search, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../components/ui/PageHeader";
import { NoStudentsState } from "../../../components/ui/NoStudentsState";
import { ClassTermFilter } from "../components/ClassTermFilter";
import { useAttendanceData } from "../../../app/providers/AttendanceDataProvider";
import "./ClassesPage.css";

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value)) : "No import yet";
}

function classInitials(subject: string, code: string) {
  const source = code.trim() || subject.trim();
  const words = source.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (words.length > 1) return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  const compact = words[0] || "CL";
  return compact.replace(/\d+.*$/, "").slice(0, 2).toUpperCase() || compact.slice(0, 2).toUpperCase();
}

export function ClassesPage() {
  const { classes, activeClassId, selectClass, deleteClass, user, isLoading, dataError } = useAttendanceData();
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("all");
  const [openingClassId, setOpeningClassId] = useState("");
  const terms = [...new Set(classes.map((item) => item.term))].sort().reverse();
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return classes.filter((item) => (term === "all" || item.term === term) &&
      (!query || `${item.subject} ${item.class_code} ${item.section} ${item.grade_level}`.toLocaleLowerCase().includes(query)));
  }, [classes, search, term]);

  async function openClass(id: string) {
    setOpeningClassId(id);
    try { await selectClass(id); }
    finally { setOpeningClassId(""); }
  }

  const canManageStaff = user?.school_roles.includes("administrator") || user?.school_roles.includes("technical_administrator");

  return <main className="page-classes">
    <PageHeader title="My classes" description="Move between class sections without mixing their attendance records." actions={<Link className="button button-primary" to="/import"><FileUp size={16} /> Add attendance data</Link>} />
    {canManageStaff && <div className="teacher-management-row"><div><span>Signed in as</span><strong>{user?.display_name} / {user?.school_name}</strong></div><Link className="button button-secondary" to="/staff">Manage staff and class access <ArrowRight size={15} /></Link></div>}
    <section className="class-workspace-toolbar" aria-label="Filter classes">
      <label className="class-search"><Search size={16} /><span className="sr-only">Search classes</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search subject, code, or section" /></label>
      <ClassTermFilter terms={terms} value={term} onChange={setTerm} />
      <span className="class-result-count">{classes.filter((item) => item.assigned).length} assigned / {filtered.length} shown</span>
    </section>

    {isLoading ? <div className="class-empty"><strong>Loading your classes</strong><span>Connecting to your saved attendance workspace.</span></div> : dataError && !classes.length ? <div className="class-empty" role="alert"><strong>Classes could not be loaded</strong><span>{dataError}</span></div> : !classes.length ? <NoStudentsState /> : !filtered.length ? <div className="class-empty"><Search size={22} /><strong>No classes match those filters</strong><span>Try another class name or term.</span></div> : <div className="class-table-wrap"><table className="class-table"><thead><tr><th>Class</th><th>Term</th><th>Students</th><th>Sessions</th><th>Last import</th><th>Access</th><th /></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} className={item.id === activeClassId ? "class-row-active" : ""}>
      <td><div className="class-name"><span className="class-icon" aria-label={`${item.subject} workspace`}>{classInitials(item.subject, item.class_code)}</span><span><strong>{item.subject}</strong><small>{item.class_code} / {item.section} / {item.grade_level}</small></span></div></td>
      <td>{item.term}</td>
      <td><span className="class-count"><UsersRound size={14} />{item.student_count}</span></td>
      <td><span className="class-count"><CalendarDays size={14} />{item.session_count}</span></td>
      <td><span className="class-date">{formatDate(item.uploaded_at)}</span><small className="class-source">{item.source_filename}</small></td>
      <td>{item.assigned ? "Assigned" : "Unassigned"}</td>
      <td><button className="button button-secondary class-open" disabled={openingClassId === item.id || item.id === activeClassId} onClick={() => void openClass(item.id)}>{item.id === activeClassId ? "Active class" : openingClassId === item.id ? "Opening..." : "Open class"}{item.id !== activeClassId && <ArrowRight size={14} />}</button>{canManageStaff && <DeleteClassButton id={item.id} name={`${item.subject} / ${item.section}`} onDelete={deleteClass} />}</td>
    </tr>)}</tbody></table></div>}
    <p className="class-workspace-note">Each imported section has its own roster, attendance history, trend, and review flags. Administrators manage staff accounts and class assignments on the Staff &amp; access page.</p>
  </main>;
}
