# Mock Data

Mock data is relational at the domain level: students have programs, sections, attendance rates, risk levels, and stable IDs. Attendance records reference the same student IDs and names used by student pages. Analytics series are kept in `src/mocks/analytics.ts` and exposed through the analytics service.

Replace fixtures with API responses without changing feature page contracts.
