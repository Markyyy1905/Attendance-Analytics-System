# ClassPulse

ClassPulse is a production-oriented React frontend foundation for attendance analytics in educational institutions. The current implementation is UI-only and uses relational mock data behind API-shaped query hooks.

## Stack

- React 19 + TypeScript strict mode
- Vite
- React Router
- Tailwind CSS v4 via `@tailwindcss/vite`
- TanStack Query for server-shaped state
- Zustand for client UI state
- React Hook Form + Zod for typed forms
- Recharts for analytics
- Lucide React for icons
- date-fns ready for date formatting

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

## Structure

`src/app` owns providers, layouts, and route configuration. `src/features` owns domain pages and hooks. `src/components` contains shared UI and chart primitives. `src/mocks` contains relational mock records. `src/services/api` is the seam where mock methods can be replaced with a real client. `src/stores` contains UI-only global state.

## Routes

Authentication: `/login`, `/forgot-password`, `/reset-password`

Application: `/app/dashboard`, `/app/attendance/records`, `/app/attendance/upload`, `/app/students`, `/app/students/:studentId`, `/app/at-risk`, `/app/interventions`, `/app/classes`, `/app/analytics/overview`, `/app/analytics/trends`, `/app/analytics/absences`, `/app/analytics/lateness`, `/app/analytics/comparisons`, `/app/reports`, `/app/report-builder`, `/app/exports`, `/app/notifications`, `/app/alerts`, `/app/data-quality`, `/app/settings`

## Roles

The demo role switcher in the sidebar cycles between Administrator and Faculty. Role and permission definitions live in `src/lib/permissions.ts`. This is frontend presentation only and must not replace backend authorization.

## Replacing mocks with APIs

Keep page components consuming feature hooks such as `useStudents`, `useAttendanceRecords`, and `useAttendanceAnalytics`. Replace the method implementations in `src/services/api/mockApi.ts` with API client calls and preserve the returned domain types. Query keys and cache behavior can remain in the feature hooks.

## Environment

Copy `.env.example` to `.env` and set `VITE_API_URL`, `VITE_APP_NAME`, and `VITE_APP_ENV` when a backend is available.
