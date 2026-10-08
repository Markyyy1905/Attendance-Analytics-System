import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Activity,
  BarChart3,
  BookOpenCheck,
  Layers3,
  FileSpreadsheet,
  LayoutDashboard,
  Menu,
  UsersRound,
  X,
} from "lucide-react";
import { useAttendanceData } from "../../app/providers/AttendanceDataProvider";
import { ClassSwitcher } from "./ClassSwitcher";
import "./AppShell.css";

const workspaceLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/classes", label: "My classes", icon: Layers3 },
  { to: "/attendance", label: "Attendance", icon: BookOpenCheck },
  { to: "/students", label: "Students", icon: UsersRound },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { dataset, classes, activeClassId, selectClass, isLoading, dataError, user, signOut } = useAttendanceData();
  const assignedClasses = classes.filter((item) => item.assigned);


  return (
    <div className="app-frame">
      {menuOpen && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside id="sidebar-navigation" className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup" aria-label="TalaTrack">
          <img className="brand-mark-image" src="/image.png" alt="" aria-hidden="true" />
          <div className="brand-wordmark"><strong>TalaTrack</strong><span>Attendance insights</span></div>
          <button className="icon-button mobile-close" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={18} /></button>
        </div>

        <ClassSwitcher classes={assignedClasses} workspaceCode={dataset.metadata.subjectCode} activeClassId={activeClassId} isLoading={isLoading} onSelect={(id) => void selectClass(id)} />

        <nav className="primary-nav" aria-label="Main navigation">
          <span className="nav-section-label">Workspace</span>
          {workspaceLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`} onClick={() => setMenuOpen(false)}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            </NavLink>
          ))}
          {(user?.roles.includes("administrator") || user?.roles.includes("technical_administrator")) && <NavLink to="/staff" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`} onClick={() => setMenuOpen(false)}><UsersRound size={18} strokeWidth={1.8} /><span>Staff and access</span></NavLink>}
          <span className="nav-section-label nav-section-spaced">Data</span>
          <NavLink to="/import" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`} onClick={() => setMenuOpen(false)}>
            <FileSpreadsheet size={18} strokeWidth={1.8} /><span>Import attendance</span>
          </NavLink>
        </nav>

        <div className="sidebar-foot">
          <div className="data-status"><span className="status-indicator" /><div><strong>{dataError ? "Database unavailable" : isLoading ? "Loading PostgreSQL" : dataset.students.length ? "Saved attendance data" : "No attendance data"}</strong><span>{dataset.students.length} students · {dataset.dates.length} dates · {assignedClasses.length} assigned classes</span></div></div>
          <div className="sidebar-foot-note"><Activity size={15} /><span>Attendance records persist in PostgreSQL</span></div>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="sidebar-navigation" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-separator">/</span><strong>{dataset.metadata.section ? `${dataset.metadata.section} · ${dataset.metadata.term}` : "Attendance overview"}</strong></div>
          <div className="topbar-tools">
            <span className="prototype-badge"><span />{dataError ? " Database offline" : isLoading ? " Connecting…" : " PostgreSQL"}</span>
            <div className="teacher-profile"><div className="teacher-avatar">{user?.display_name.split(/\s+/).slice(0,2).map((part)=>part[0]).join("").toUpperCase()||"U"}</div><div><strong>{user?.display_name}</strong><span>{user?.school_name} · {user?.roles.join(", ")}</span></div><button className="button button-secondary" onClick={()=>void signOut()}>Sign out</button></div>
          </div>
        </header>
        <div className="main-content"><Outlet /></div>
      </div>
    </div>
  );
}
