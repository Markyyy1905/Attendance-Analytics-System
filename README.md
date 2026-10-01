# Attendwise · Attendance Analytics Prototype

A fresh, presentation-ready attendance analytics prototype for teachers. It shows how a class CSV is checked, reviewed, and used across an attendance dashboard, class register, student profiles, and analytics.

All default figures are illustrative. CSV imports stay in browser memory for the current tab and replace the demo dataset until refresh. No student records are sent to a server.

## Start the app

```bash
npm install
npm run dev
```

Open the local address printed by Vite. The stack is React, TypeScript, and Vite.

## Main flow

1. Open **Import attendance** and select a `.csv` file.
2. The browser checks the metadata, dated columns, student rows, and attendance marks.
3. Review the validation messages and record preview.
4. Apply a valid dataset to the current session.
5. Review the updated class overview, attendance matrix, student profiles, and analytics.

Use **Reset to demo data** in the sidebar to restore the illustrative class. Refreshing the page also starts from demo data.

## CSV shape

The parser supports the supplied metadata rows followed by a header row beginning with `Student`. A file can contain multiple class blocks, each with its own metadata, dates, and student rows. Section-specific dates are combined in overview and analytics; filter the attendance matrix or roster by section to review one group at a time. Student rows use `P` (present), `A` (absent), `L` (late), or a blank cell. The column count is dynamic, so the file can grow as more dates are added. Use **Download template** on the import page to get a starter CSV.

The attached brief does not define the attendance percentage formula. This demo uses present marks divided by all recorded marks, with late marks shown separately. Confirm the institution’s formula before connecting live records.

## Project structure

```text
src/
  app/                          routes and app-level data provider
  components/                   shared layout, charts, and UI primitives
  features/
    analytics/pages/             analytics screen and its page styles
    attendance/pages/            attendance screen and its page styles
    dashboard/pages/             overview screen and its page styles
    import/pages/                import flow and its page styles
    import/services/              CSV parser
    students/pages/               roster and student profile screens
  mocks/                         removable demonstration records
  services/attendance/            repository seam for a future API
  shared/lib/                     attendance calculations
  shared/styles/                  design tokens and global styles
  shared/types/                   domain types
```

Each page and its CSS live beside each other. Parsing and calculations stay in feature or shared service modules; page components handle presentation and interaction.

## Reference documents

- [System flow](docs/system-flow.md)
- [Architecture](docs/architecture.md)
- [CSV format and validation](docs/csv-template.md)
- [Mock data and replacement](docs/mock-data.md)
- [Future backend integration](docs/future-backend-integration.md)
