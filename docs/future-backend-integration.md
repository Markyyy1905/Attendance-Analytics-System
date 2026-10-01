# Future backend integration

The prototype is browser-only. Before using actual student data, add a server boundary and replace the repository adapter while preserving the `AttendanceDataset` contract.

1. Add a typed API client in `src/services/attendance/` using an environment-configured base URL.
2. Move file validation and persistence to a server endpoint if uploaded files must be centrally stored.
3. Add authentication and server-side authorization for teachers, coordinators, department heads, and administrators.
4. Derive class and student access on the server; client-side navigation is not an authorization boundary.
5. Store import jobs and row-level validation outcomes so users can audit corrections and reprocess data.
6. Define the official attendance-rate formula, timezone/date interpretation, and risk policy with the institution.
7. Add server-backed reports only after export formats and privacy requirements are agreed.
8. Remove demonstration fixtures and session-only import behavior after the live data path is ready.

The attached document lists Excel upload and PDF/Excel exports as intended capabilities. They are not implemented in this CSV demonstration.
