import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Activity,
  BarChart3,
  BookOpenCheck,
  ChevronDown,
  FileSpreadsheet,
  GraduationCap,
  LayoutDashboard,
  Menu,
  RotateCcw,
  UsersRound,
  X,
} from "lucide-react";
import { useAttendanceData } from "../../app/providers/AttendanceDataProvider";
import "./AppShell.css";

const workspaceLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/attendance", label: "Attendance", icon: BookOpenCheck },
  { to: "/students", label: "Students", icon: UsersRound },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { dataset, isDemo, resetDemo } = useAttendanceData();

  return (
    <div className="app-frame">
      {menuOpen && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><GraduationCap size={20} strokeWidth={1.9} /></div>
          <div><strong>Attendwise</strong><span>Attendance insights</span></div>
          <button className="icon-button mobile-close" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={18} /></button>
        </div>

        <div className="workspace-switcher">
          <div className="workspace-avatar">{dataset.metadata.subjectCode.slice(0, 2) || "CL"}</div>
          <div className="workspace-copy"><span>Teaching workspace</span><strong>{dataset.sections.length > 1 ? "All sections" : dataset.metadata.section || "All classes"}</strong></div>
          <ChevronDown size={15} />
        </div>

        <nav className="primary-nav" aria-label="Main navigation">
          <span className="nav-section-label">Workspace</span>
          {workspaceLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`} onClick={() => setMenuOpen(false)}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            </NavLink>
          ))}
          <span className="nav-section-label nav-section-spaced">Data</span>
          <NavLink to="/import" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`} onClick={() => setMenuOpen(false)}>
            <FileSpreadsheet size={18} strokeWidth={1.8} /><span>Import attendance</span>
          </NavLink>
        </nav>

        <div className="sidebar-foot">
          <div className="data-status"><span className="status-indicator" /><div><strong>{isDemo ? "Demo dataset" : "Imported for this session"}</strong><span>{dataset.students.length} students · {dataset.dates.length} dates</span></div></div>
          {!isDemo && <button className="reset-demo-button" onClick={resetDemo}><RotateCcw size={14} /> Reset to demo data</button>}
          <div className="sidebar-foot-note"><Activity size={15} /><span>Prototype · data stays in this tab</span></div>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-separator">/</span><strong>{dataset.metadata.term || "Attendance overview"}</strong></div>
          <div className="topbar-tools">
            <span className="prototype-badge"><span /> Prototype data</span>
            <div className="teacher-profile"><div className="teacher-avatar">JM</div><div><strong>Jamie Morgan</strong><span>Teacher</span></div><ChevronDown size={15} /></div>
          </div>
        </header>
        <div className="main-content"><Outlet /></div>
      </div>
    </div>
  );
}
