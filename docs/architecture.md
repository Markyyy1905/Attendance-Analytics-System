# Architecture

The prototype uses a feature-oriented React + TypeScript structure. Each feature owns its pages and page styles. Reusable layout, charts, and interface primitives sit in `components`; attendance types and calculations sit in `shared`.

## Boundaries

- `app/` owns routes and the session-level attendance data provider.
- `features/<feature>/pages/` owns route-level views and adjacent CSS files.
- `features/import/services/` parses uploaded attendance files into the domain model.
- `shared/types/` defines the types passed between screens and services.
- `shared/lib/` holds calculations used by more than one view.
- `services/attendance/` owns the repository seam. The current repository adapter returns illustrative mock records.
- `mocks/` is the one location for default fictional attendance records.
- `components/` holds shared layout, chart, and UI elements.

## Data flow

```text
Page → AttendanceDataProvider → AttendanceRepository → demo fixture
  ↑              ↑
  └── shared calculations

CSV file → CSV parser → validated AttendanceDataset → provider replacement → all pages
```

The provider holds data in React state only. Imported rows are not saved to local storage or sent to a service. Reloading restores the mock repository. The importer is an input adapter; it does not contain dashboard or risk calculations.

## Replaceable data source

`AttendanceRepository` is the future integration boundary. Replace `mockAttendanceRepository` with an API-backed implementation while returning the same `AttendanceDataset` contract. Keep CSV parsing and page components independent from HTTP details.
