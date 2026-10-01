import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { StudentsPage } from '../features/students/pages/StudentsPage';
import { AttendanceRecordsPage } from '../features/attendance/pages/AttendanceRecordsPage';
import { AnalyticsPage } from '../features/analytics/pages/AnalyticsPage';
import { PlaceholderPage } from '../features/common/pages/PlaceholderPage';

const placeholder = (title: string, kicker = 'Workspace') => <PlaceholderPage title={title} kicker={kicker} />;
export const router = createBrowserRouter([
  { element: <AuthLayout />, children: [{ path: '/', element: <Navigate to="/login" replace /> }, { path: '/login', element: <LoginPage /> }, { path: '/forgot-password', element: placeholder('Forgot password', 'Authentication') }, { path: '/reset-password', element: placeholder('Reset password', 'Authentication') }] },
  { path: '/app', element: <DashboardLayout />, children: [
    { index: true, element: <Navigate to="dashboard" replace /> }, { path: 'dashboard', element: <DashboardPage /> },
    { path: 'attendance/records', element: <AttendanceRecordsPage /> }, { path: 'attendance/upload', element: placeholder('Upload attendance', 'Attendance') }, { path: 'attendance/sessions', element: placeholder('Attendance sessions', 'Attendance') }, { path: 'attendance/calendar', element: placeholder('Attendance calendar', 'Attendance') },
    { path: 'students', element: <StudentsPage /> }, { path: 'students/:studentId', element: placeholder('Student profile', 'Students') }, { path: 'at-risk', element: placeholder('At-risk students', 'Insights') }, { path: 'interventions', element: placeholder('Interventions', 'Insights') },
    { path: 'classes', element: placeholder('My classes', 'Classes') }, { path: 'classes/:classId', element: placeholder('Class detail', 'Classes') },
    { path: 'analytics/overview', element: <AnalyticsPage /> }, { path: 'analytics/trends', element: placeholder('Trend analysis', 'Analytics') }, { path: 'analytics/absences', element: placeholder('Absence analysis', 'Analytics') }, { path: 'analytics/lateness', element: placeholder('Late analysis', 'Analytics') }, { path: 'analytics/comparisons', element: placeholder('Comparative analytics', 'Analytics') },
    { path: 'reports', element: placeholder('Reports', 'Operations') }, { path: 'report-builder', element: placeholder('Report builder', 'Operations') }, { path: 'exports', element: placeholder('Export history', 'Operations') }, { path: 'notifications', element: placeholder('Notifications', 'Operations') }, { path: 'alerts', element: placeholder('Alerts', 'Operations') }, { path: 'data-quality', element: placeholder('Data quality', 'Operations') }, { path: 'settings', element: placeholder('Settings', 'Administration') },
  ] },
  { path: '*', element: placeholder('Page not found', 'Error') },
]);
