import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ArrowRight, UserRoundCog } from "lucide-react";
import { PageHeader } from "../../../components/ui/PageHeader";
import { NoStudentsState } from "../../../components/ui/NoStudentsState";
import { useAttendanceData } from "../../../app/providers/AttendanceDataProvider";
import { CreateTeacherForm } from "../components/CreateTeacherForm";
import { StaffMemberSelect } from "../components/StaffMemberSelect";
import "./StaffPage.css";

export function StaffPage() {
  const { refreshTeachers, user, teachers, managementClasses: classes, activeTeacherId, selectTeacher, createTeacher, assignClass, isLoading, dataError } = useAttendanceData();
  useEffect(() => { if (activeTeacherId) void selectTeacher(activeTeacherId); }, [activeTeacherId, selectTeacher]);
  useEffect(() => { void refreshTeachers(); }, [refreshTeachers]);
  const [savingClassId, setSavingClassId] = useState("");
  const [assignmentError, setAssignmentError] = useState("");
  const isAdministrator = user?.school_roles.includes("administrator") || user?.school_roles.includes("technical_administrator");

  if (!isAdministrator) return <Navigate to="/dashboard" replace />;

  async function toggleAssignment(classId: string, assigned: boolean) {
    setSavingClassId(classId);
    setAssignmentError("");
    try {
      await assignClass(classId, !assigned);
    } catch (cause) {
      setAssignmentError(cause instanceof Error ? cause.message : "Could not update class access.");
    } finally {
      setSavingClassId("");
    }
  }

  const activeTeacher = teachers.find((teacher) => teacher.id === activeTeacherId);

  return <main className="page-staff">
    <PageHeader title="Staff and class access" description="Create staff accounts and assign the classes each person can review." />
    <CreateTeacherForm onCreate={createTeacher} />
    <section className="panel staff-access-panel">
      <div className="staff-access-heading">
        <div><h2>Class assignments</h2><p>All active staff in this school are listed. Create staff here to add them to this school.</p></div>
        <StaffMemberSelect staff={teachers} value={activeTeacherId} onChange={(id) => void selectTeacher(id)} />
      </div>
      {dataError && <p className="staff-form-error" role="alert">{dataError}</p>}
      {assignmentError && <p className="staff-form-error" role="alert">{assignmentError}</p>}
      <p className="staff-selected-person"><UserRoundCog size={16} /> Access for <strong>{activeTeacher?.display_name || "selected staff member"}</strong></p>
      {isLoading ? <div className="staff-empty"><strong>Loading class access</strong><span>Retrieving school classes and current assignments.</span></div> : dataError && !classes.length ? <div className="staff-empty" role="alert"><strong>Class access unavailable</strong><span>{dataError}</span></div> : !classes.length ? <NoStudentsState description="Import an attendance CSV to create school classes and student records. Assign class access here after import." /> : <div className="staff-table-wrap"><table className="staff-table"><thead><tr><th>Class</th><th>Term</th><th>Students</th><th>Sessions</th><th>Access</th><th /></tr></thead><tbody>{classes.map((item) => <tr key={item.id}><td><strong>{item.subject}</strong><span>{item.class_code} / {item.section} / {item.grade_level}</span></td><td>{item.term}</td><td>{item.student_count}</td><td>{item.session_count}</td><td><span className={item.assigned ? "staff-access-granted" : "staff-access-none"}>{item.assigned ? "Has access" : "No access"}</span></td><td><button className={`button ${item.assigned ? "button-secondary" : "button-primary"} staff-assignment-button`} type="button" disabled={savingClassId === item.id} onClick={() => void toggleAssignment(item.id, item.assigned)}>{savingClassId === item.id ? "Saving..." : item.assigned ? "Remove access" : "Assign class"}{savingClassId !== item.id && <ArrowRight size={14} />}</button></td></tr>)}</tbody></table></div>}
    </section>
    <p className="staff-security-note">Class access is enforced by the server for every request. Keep temporary passwords private and deliver them to staff through a secure channel.</p>
  </main>;
}
