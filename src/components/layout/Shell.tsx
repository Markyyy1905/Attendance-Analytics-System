import { Bell, CalendarDays, ChevronRight, CircleHelp, FileText, Filter, LayoutDashboard, Menu, PanelLeftClose, Search, Settings, ShieldAlert, SlidersHorizontal, Users, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/uiStore';
import type { UserRole } from '../../types/domain';
import { Avatar } from '../ui/Avatar';

const groups = [
  { label: 'Workspace', items: [{ label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard }, { label: 'Attendance', path: '/app/attendance/records', icon: CalendarDays }, { label: 'Students', path: '/app/students', icon: Users }, { label: 'My Classes', path: '/app/classes', icon: FileText }] },
  { label: 'Insights', items: [{ label: 'Analytics', path: '/app/analytics/overview', icon: SlidersHorizontal }, { label: 'At-Risk Students', path: '/app/at-risk', icon: ShieldAlert }, { label: 'Interventions', path: '/app/interventions', icon: ShieldAlert }] },
  { label: 'Operations', items: [{ label: 'Reports', path: '/app/reports', icon: FileText }, { label: 'Data Quality', path: '/app/data-quality', icon: Filter }] },
];
const roleLabels: Record<UserRole, string> = { faculty: 'Faculty', program_coordinator: 'Program Coordinator', department_head: 'Department Head', administrator: 'Administrator' };

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, sidebarOpen, sidebarCollapsed, setSidebarOpen, setSidebarCollapsed, setRole } = useUiStore();
  const [search, setSearch] = useState('');
  const searchResults = search ? [{ label: 'Maria Santos', detail: 'Student · BSIT 2A', path: '/app/students/2024-001' }, { label: 'Attendance records', detail: 'Workspace', path: '/app/attendance/records' }, { label: 'Attendance analytics', detail: 'Insights', path: '/app/analytics/overview' }].filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(search.toLowerCase())) : [];
  return <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="brand">
        <button className="brand-logo" onClick={() => sidebarCollapsed && setSidebarCollapsed(false)} aria-label={sidebarCollapsed ? 'Expand navigation' : 'ClassPulse home'} title={sidebarCollapsed ? 'Expand navigation' : undefined}><span className="brand-mark">C</span></button>
        <span>classpulse</span>
        {!sidebarCollapsed && <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(true)} aria-label="Collapse navigation" title="Collapse navigation"><PanelLeftClose size={18} /></button>}
        <button className="close-sidebar" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={18} /></button>
      </div>
      <div className="workspace-switcher"><div className="school-mark">SV</div><div><strong>Saint Victoria College</strong><span>{roleLabels[role]} workspace</span></div></div>
      <nav>{groups.map((group) => <div className="nav-group" key={group.label}><span className="nav-label">{group.label}</span>{group.items.map(({ label, path, icon: Icon }) => <Link className={`nav-item ${location.pathname.startsWith(path) ? 'active' : ''}`} key={path} to={path} onClick={() => setSidebarOpen(false)} title={sidebarCollapsed ? label : undefined}><Icon size={17} /><span>{label}</span>{label === 'At-Risk Students' && <span className="nav-count">47</span>}</Link>)}</div>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => setRole(role === 'administrator' ? 'faculty' : 'administrator')} title={sidebarCollapsed ? 'Switch role' : undefined}><Settings size={17} /><span>Switch role</span></button><Link className="nav-item" to="/app/settings" title={sidebarCollapsed ? 'Settings' : undefined}><Settings size={17} /><span>Settings</span></Link><div className="user-card"><Avatar initials="CR" className="user-avatar" /><div><strong>Camille Reyes</strong><span>{roleLabels[role]}</span></div></div></div>
    </aside>
    <div className="main-area"><header className="topbar"><button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{location.pathname.split('/').filter(Boolean).pop()}</strong></div><div className="topbar-actions"><div className="global-search"><div className="top-search"><Search size={16} /><input aria-label="Global search" value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && searchResults[0]) { navigate(searchResults[0].path); setSearch(''); } }} placeholder="Search anything" /><kbd>Ctrl K</kbd></div>{search && <div className="search-results">{searchResults.length ? searchResults.map((result) => <button type="button" key={result.path} onClick={() => { navigate(result.path); setSearch(''); }}><strong>{result.label}</strong><span>{result.detail}</span></button>) : <span className="search-empty">No matching workspace results</span>}</div>}</div><button className="top-icon" aria-label="Notifications"><Bell size={18} /><i /></button><button className="top-icon" aria-label="Help"><CircleHelp size={18} /></button><Avatar initials="CR" className="top-avatar" /></div></header>{children}</div>
  </div>;
}
