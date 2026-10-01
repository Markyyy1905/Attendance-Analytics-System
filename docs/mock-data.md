# Mock data

All initial records come from `src/mocks/attendanceDemo.ts`. The names are fictional, and the dataset is labelled as illustrative in the interface. Do not copy personal student data from the sample attachment into demo fixtures.

The demo repository is `src/services/attendance/attendanceRepository.ts`; the provider loads it on page start. Uploaded CSV records replace the dataset in browser memory for the current tab. The import is not persisted, and a page refresh loads the mock dataset again.

When real records are ready:

1. Replace the fixture behind the repository seam with an API-backed repository.
2. Keep the imported CSV parser only if manual file intake remains a product requirement.
3. Confirm rate formulas, date/time rules, and risk thresholds with the institution.
4. Remove `src/mocks/attendanceDemo.ts` and the reset-to-demo control when mock mode is no longer needed.

Shared pages and calculations consume the `AttendanceDataset` type from `src/shared/types/attendance.ts`.
