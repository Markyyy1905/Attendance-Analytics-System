import { Navigate, Route, Routes } from "react-router-dom";
import { AttendanceDataProvider, useAttendanceData } from "./providers/AttendanceDataProvider";
import { AppShell } from "../components/layout/AppShell";
import { OverviewPage } from "../features/dashboard/pages/OverviewPage";
import { AttendancePage } from "../features/attendance/pages/AttendancePage";
import { StudentsPage } from "../features/students/pages/StudentsPage";
import { StudentDetailPage } from "../features/students/pages/StudentDetailPage";
import { AnalyticsPage } from "../features/analytics/pages/AnalyticsPage";
import { ImportPage } from "../features/import/pages/ImportPage";
import { ClassesPage } from "../features/classes/pages/ClassesPage";
import { StaffPage } from "../features/classes/pages/StaffPage";
import { LoginPage } from "../features/auth/LoginPage";
function ApplicationRoutes(){const {user,authReady}=useAttendanceData();if(!authReady)return <div className="auth-page"><p>Connecting to TalaTrack…</p></div>;if(!user)return <LoginPage/>;return <Routes><Route element={<AppShell/>}><Route index element={<Navigate to="/dashboard" replace/>}/><Route path="dashboard" element={<OverviewPage/>}/><Route path="classes" element={<ClassesPage/>}/><Route path="staff" element={<StaffPage/>}/><Route path="attendance" element={<AttendancePage/>}/><Route path="students" element={<StudentsPage/>}/><Route path="students/:studentId" element={<StudentDetailPage/>}/><Route path="analytics" element={<AnalyticsPage/>}/><Route path="import" element={<ImportPage/>}/><Route path="*" element={<Navigate to="/dashboard" replace/>}/></Route></Routes>}
export function App(){return <AttendanceDataProvider><ApplicationRoutes/></AttendanceDataProvider>}
