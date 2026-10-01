import { Navigate, Route, Routes } from "react-router-dom";
import { AttendanceDataProvider } from "./providers/AttendanceDataProvider";
import { AppShell } from "../components/layout/AppShell";
import { OverviewPage } from "../features/dashboard/pages/OverviewPage";
import { AttendancePage } from "../features/attendance/pages/AttendancePage";
import { StudentsPage } from "../features/students/pages/StudentsPage";
import { StudentDetailPage } from "../features/students/pages/StudentDetailPage";
import { AnalyticsPage } from "../features/analytics/pages/AnalyticsPage";
import { ImportPage } from "../features/import/pages/ImportPage";

export function App() {
  return (
    <AttendanceDataProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<OverviewPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/:studentId" element={<StudentDetailPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="import" element={<ImportPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </AttendanceDataProvider>
  );
}
