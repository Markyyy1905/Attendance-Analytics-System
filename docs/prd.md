# Product Requirements Document: TalaTrack

**Status:** Working pilot baseline; school policy and production gates remain open
**Product:** Teacher-facing attendance monitoring and analytics system
**Current baseline:** React + TypeScript + Vite, Node.js API, PostgreSQL persistence, account login, and CSV import
**Document owner:** Product / School implementation team

## 1. Summary

TalaTrack helps teachers and authorized school staff maintain reliable attendance records, understand class and student attendance patterns, and follow up with students who may need support. It should turn trusted attendance data into transparent, explainable summaries and timely human review. Analytics and predictions are decision support; staff remain responsible for interpreting context and choosing interventions.

The application supports school workspace registration, staff sign-in, assigned class workspaces, CSV preview and PostgreSQL persistence, dashboard and student history, descriptive analytics, and an exploratory class-level projection. It starts empty when no attendance records exist. The system is a pilot foundation, not yet a school-approved production service; matching by name, policy configuration, privacy operations, recovery, and other launch gates remain. The projection is planning context, not a validated forecast.

## 2. Problem and opportunity

The study focuses on collecting and organizing attendance records for 4th-year Computer Science students at Lyceum of Alabang, then presenting patterns and trends that help authorized staff monitor attendance more efficiently. TalaTrack persists imported records and enforces school/class access; approved attendance policy, authoritative student matching, and validated predictions remain future work.

## 3. Goals and non-goals

### Goals

- Give each staff member a clear, role-appropriate view of the classes and students they are authorized to see.
- Record, correct, import, and review attendance with clear provenance and an audit trail.
- Apply school-approved attendance definitions, calendars, thresholds, and exception handling consistently.
- Help staff identify changes and patterns at class and student levels, with enough context to verify each insight.
- Support appropriate follow-up and show whether it occurred, without automating disciplinary or welfare decisions.
- Protect student information through secure access, retention, and operational controls defined with the school.

### Non-goals for the first school pilot

- Automated decisions about discipline, promotion, safeguarding, or student eligibility.
- A general-purpose student information system, gradebook, timetable builder, or parent portal.
- Claims that a model can predict an individual student's future attendance reliably before it is validated on representative school data.
- Replacing the school's official system of record unless an explicit integration and ownership agreement is made.

## 4. Users and jobs to be done

| User | Needs |
|---|---|
| Teacher / homeroom teacher | Take or import attendance for assigned classes; find a student quickly; understand recent changes; document follow-up. |
| Coordinator / department head | Compare attendance across authorized classes and periods; review exceptions; coordinate support. |
| School administrator | Configure terms, calendars, attendance codes, policies, accounts, permissions, and retention; review system-wide reports. |
| Data / IT administrator | Manage integrations, imports, backups, access reviews, and operational incidents. |

Students are the people represented by the records, not direct users of the initial staff application. Any future student or guardian access requires a separate product and policy decision.

## 5. Product principles

1. **Accuracy before insight:** every metric shows its definition, period, scope, and source.
2. **Human review:** flags and forecasts explain their evidence and uncertainty; staff make decisions.
3. **Least access:** users see only the records needed for their assigned role.
4. **Traceability:** imports, edits, corrections, exports, and policy changes are attributable and reviewable.
5. **Respectful language:** describe observed attendance, not a student as a problem or risk.
6. **Accessible by default:** core workflows work with keyboard, screen reader, zoom, and small screens.

## 6. Current system review

### Existing capabilities

- The app has school workspace registration, email/password sign-in and sign-out, PostgreSQL sessions, administrator-provisioned staff accounts, and server-side school/class access checks.
- PostgreSQL is the only attendance data source; the app starts empty when no records exist.
- The shared Node API is used by Vite locally and a Vercel function in deployment. CSV section blocks are saved as separate classes.
- CSV preview reports row errors/warnings before a transaction commits; import jobs and attendance changes are auditable.
- Shared calculations drive the overview, roster, student profiles, attendance matrix, session and weekday analytics, review flags, and the indicative class projection.
- Session trends and projections have visible data-table details; denominator, coverage, formula, and projection limitations are presented.
- Class analytics can be exported as CSV; report requests and exports are recorded in PostgreSQL.

### Remaining gaps before school use

- The API has local email/password accounts, but email verification, password recovery, MFA, and school SSO are not implemented.
- Production backup/recovery, retention/deletion automation, monitoring, and incident response are not configured or demonstrated.
- Imports preview before an atomic upsert, but do not stage conflicts for resolution or support rollback/reprocessing UI.
- Attendance-taking/editing, approval workflow, and correction UI are not implemented.
- Policy and calendar decisions remain provisional; partial-day handling and effective enrollment rules need school approval.
- Student matching uses normalized names within a class rather than an approved stable school identifier.
- The class projection is an exploratory baseline and is not a validated forecast.
- PDF/XLSX reports, external integrations, follow-up workflows, and paid subscription controls are not implemented.

### Implementation-specific concerns

- Session uniqueness currently uses one class meeting timestamp; schools with multiple meetings on one date must provide distinct meeting times/session identifiers.
- Blank marks are represented by missing attendance rows and are never inferred absent.
- Imports require ISO dates and match by normalized name within a class; ambiguous duplicates are blocked. This is less reliable than an authoritative school identifier and should be reviewed during pilot discovery.
- The class selector and data API enforce current school and class grants; access policies still need school role review before operational use.
## 7. Scope and phased delivery

### Phase 0: School discovery and policy decisions

- Confirm official source of truth and whether this application writes attendance or only analyzes imported records.
- Define attendance codes, rate formula, late/partial-day rules, excused statuses, thresholds, streak semantics, enrollment windows, school calendar, and time zone.
- Map roles, class assignment rules, approval/correction workflow, escalation boundaries, and who may export.
- Identify source-system integration, student matching key, data owner, retention/deletion rules, and applicable jurisdictional requirements.
- Select pilot classes, baseline measures, and staff who will validate outputs.

### Phase 1: Secure operational pilot (MVP)

- Authenticated staff accounts and server-side role/class authorization.
- Persistent school, term, class, roster, student, calendar/session, and attendance data.
- Teacher class selector and a reliable attendance review/taking or approved import workflow.
- Import staging, validation, student matching, duplicate handling, previewed create/update actions, commit, and rollback/reprocessing.
- Versioned attendance policy configuration and transparent summary calculations.
- Student history and class dashboard with explainable review flags.
- Follow-up notes/status with restricted visibility and an audit record.
- Accessible CSV/PDF reports where approved; all exports scoped and logged.
- Audit, backup/restore, monitoring, support, and retention processes sufficient for the pilot.

### Phase 2: School-wide analytics

- Authorized cross-class and term comparisons, configurable reports, filters, and scheduled summaries.
- Trend decomposition by class, grade/program, day, or period where sample size and permissions permit.
- Integrations with the official student information / timetable source to reduce manual reconciliation.
- Attendance pattern insights such as weekday/session variation, changes from a student's own baseline, and cohort comparisons with caveats.

### Phase 3: Validated forecasting

- Forecast only after the school has sufficient quality historical data and an agreed use case.
- Start with aggregate/class-level forecasts or transparent statistical baselines; evaluate whether student-level forecasting is justified.
- Show forecast horizon, data freshness, uncertainty interval, contributing factors, and known limitations.
- Validate across cohorts and relevant student groups; monitor calibration, false positives, drift, and unintended disparate impact.
- Require staff review and never trigger automatic punitive or high-impact actions.

## 8. Functional requirements

### 8.1 Identity, roles, and school structure — MVP P0

- Sign in using the school-approved identity provider; support secure sign-out, session expiry, and account deactivation.
- Enforce authorization on the server for every record and action, not only by hiding UI controls.
- Roles: teacher (assigned classes), coordinator (assigned organizational scope), administrator (school configuration), and technical administrator (platform operations); school can tune grants.
- Represent school, academic year, term, program/grade, class/section, subject, staff assignment, student, and enrollment dates.
- Log sensitive actions such as access changes, policy changes, imports, edits, and exports.

### 8.2 Attendance capture and records — MVP P0

- Select an authorized school, term, class/subject, and meeting date; show the expected roster for that meeting.
- Record the approved attendance statuses, including the school's defined treatment for late, excused, absent, school activity, and unknown/not recorded.
- Prevent accidental duplicate session submissions; allow corrections with reason, actor, timestamp, and prior value preserved.
- Clearly distinguish no record from present/absent. Do not infer absence from missing data.
- Display who recorded or changed a mark and when, subject to role permissions.
- Support roster changes and enrollment effective dates without rewriting historical attendance.

### 8.3 Import and data quality — MVP P0

- Support the agreed source formats (CSV first; XLSX only if operationally needed) with a published template and explicit encoding/date conventions.
- Stage imports before commit. Report file-level and row-level errors, warnings, matched/unmatched students, duplicate sessions, and proposed changes.
- Match imported students by normalized name within the selected class. Reject ambiguous duplicate names; never merge records automatically.
- Let an authorized user resolve mapping errors, preview impact, commit, and undo/reprocess an import.
- Preserve original source filename, uploader, upload time, checksum, parser/schema version, row outcomes, and resulting changes.
- Enforce size/type limits and safe handling of malformed files. Do not expose student data in client logs or error telemetry.

### 8.4 Dashboard, roster, and student history — MVP P0

- Show selected class/term and data freshness/source on every class-level dashboard.
- Show approved attendance rate, counts, unrecorded sessions, changes over time, and students requiring review; display denominator and date range.
- Filter/search by authorized class, student, date range, status, and review reason.
- Show student attendance history, current enrollment, reason for a flag, and prior follow-up entries the user can access.
- Provide actionable empty, loading, permission-denied, stale-data, and error states.

### 8.5 Analytics and forecasting — P1 after MVP trust baseline

- Descriptive analytics: session trend, rate/count breakdowns, chronic absence, consecutive absences, day/period patterns, and comparisons to a selected baseline.
- Each chart/table states formula, denominator, dates, filters, missing-data treatment, and source timestamp.
- Trends must use valid expected sessions and policy rules rather than treating incomplete data as equivalent to a complete session.
- Forecast feature is off until approved validation criteria are met. When enabled, show forecast range, horizon, confidence/uncertainty, freshness, factors, and model version.
- Provide an accessible data-table equivalent for every visualization.

### 8.6 Follow-up and reports — MVP P1

- Allow permitted staff to record a follow-up status, date, owner, and concise note using approved categories.
- Restrict sensitive notes to explicitly authorized roles; avoid storing unnecessary sensitive personal details.
- Export class/term reports to approved formats with generation timestamp, applied filters, formulas, and scope.
- Enforce role-based export permissions and log export metadata; avoid bulk student data by default.

### 8.7 Administration — MVP P0/P1

- Configure attendance codes, school calendar, time zone, terms, thresholds, rate formula version, and exception policy.
- Preview policy changes against sample/current data and record approval/effective date; preserve the policy version used for prior reports.
- Manage accounts, roles, class assignments, integration configuration, and data retention according to delegated permissions.

## 9. Core workflows and acceptance criteria

### Teacher reviews today's attendance

1. Teacher signs in and sees only assigned classes.
2. Teacher opens a class/date and sees the expected roster and prior/current marks.
3. Missing entries are visibly distinct from absences.
4. Teacher records or corrects marks; correction requires an approved reason and creates an audit event.
5. Saved status and last-updated details appear, and authorized summaries update from the same committed data.

### Staff imports an attendance file

1. User chooses an authorized class/term and selects a supported file.
2. System validates format, dates, statuses, IDs, duplicates, enrollment, and policy; original data remains unchanged during staging.
3. Preview states exact records to add/update/reject and identifies unresolved student matches.
4. User resolves errors or cancels; only a valid, confirmed import can commit.
5. User can inspect import history, row outcomes, and rollback/reprocess according to permissions.

### Staff reviews an attendance concern

1. Dashboard states the class, date range, metric definition, and data freshness.
2. Each flagged student has a human-readable reason with evidence and relevant history.
3. Staff can open the record, verify data quality, and record an appropriate follow-up.
4. The system does not present the flag as a diagnosis or automatically impose an outcome.

### Pilot readiness exit criteria

- School-approved policy decisions in Section 12 are documented and implemented as versioned configuration.
- Access tests demonstrate that users cannot retrieve unauthorized school/class/student records through routes or API calls.
- Import reconciliation has been validated against representative files, including duplicate, malformed, missing, and changed roster records.
- Staff and school data owner sign off on calculation examples and report totals for pilot classes.
- Backup restore, audit review, incident contact, and data retention/deletion workflows are demonstrated.
- Critical workflows meet agreed accessibility checks and work at supported desktop/tablet/mobile sizes.
- No predictive output is enabled without the evaluation gate in Section 8.5.

## 10. Data and metric definitions

### Minimum domain records

- School / tenant, academic year, term, calendar, class/subject/section, staff assignment.
- Student with an internal UUID and effective-dated enrollment/class membership. Imported display names must be unique within the selected class.
- Class meeting/session with date, timezone, expected roster context, and source.
- Attendance mark with status, actor, recorded/updated timestamps, correction reason, and source/import reference.
- Import job, file metadata, row-level result, and audit events.
- Versioned attendance policy and (when applicable) follow-up record.

### Metric contract

The school must approve and version the formula before operational use. Every displayed rate must define: included statuses in numerator and denominator; handling of late, excused, school activity, partial day, unknown and missing; expected sessions; enrollment start/end; rounding; reporting period; and timezone. “Attendance rate” must not silently mean different things in different views.

The current implementation calculates `(present + late) / (present + late + absent)`, rounds the displayed rate to the nearest whole percent, and excludes excused and blank marks from that denominator. Review flags currently trigger independently when the unrounded rate is below 75%, the recorded streak reaches five absences, or recorded absences exceed eight. These are transparent pilot assumptions, not school-approved policy. Confirm boundary behavior, streak treatment across missing sessions, exceptions, differences by program, and who may change policy before operational use.

## 11. Non-functional requirements

These are initial requirements to refine with the school and implementation team.

- **Privacy/security:** minimize collected data; encrypt transport and stored records; protect secrets; use secure sessions; apply least privilege and school isolation; log sensitive access/actions; define retention, deletion, incident response, and vendor/data-processing responsibilities.
- **Reliability:** define availability, recovery point/time, backup frequency, restore exercises, and support expectations for the pilot.
- **Performance:** agree dataset sizes and service targets; common dashboard, roster search, and attendance lookup should remain responsive for expected school/class volumes.
- **Accessibility:** target WCAG 2.2 AA for core workflows; keyboard operation, screen reader labels, visible focus, contrast, zoom/reflow, and chart alternatives.
- **Compatibility:** define supported browsers/devices and low-bandwidth behavior with school IT.
- **Auditability:** timestamped, attributable changes and export/import history with controlled retention and tamper-resistant access.
- **Data quality:** validate referential integrity, date/session uniqueness, enrollment validity, policy version, and source provenance.
- **Localization:** configure school locale, language, date format, timezone, and terminology rather than assuming US dates or English labels.

## 12. Decisions required from the school

1. What is the official system of record and is TalaTrack read-only, a capture tool, or both?
2. Which identity provider and roles/groups should supply access? What class assignment is authoritative?
3. What statuses are supported and how do late, excused, school activity, partial-day, and unknown marks affect rates?
4. What is the official attendance formula and reporting period? How are enrollment changes and missing sessions treated?
5. Are the brief's risk thresholds approved? Are they independent triggers, inclusive at boundary, and consistent across grades/programs?
6. What calendar, timezone, locale, and date formats apply? Which date is the authoritative session date?
7. What import sources and name-matching rules should apply? How are conflicts, corrections, and duplicates resolved?
8. Who may see student details, follow-up notes, cohort comparisons, and exports?
9. What follow-up workflow and terminology are appropriate? Which data must never be recorded in notes?
10. Which applicable privacy, education-record, retention, and data-residency obligations must the deployment meet?
11. What reports, accessibility target, supported devices, availability, and support expectations are required?
12. What evidence and minimum validation threshold would justify forecasting, and who approves enabling it?

## 13. Success measures

Establish a baseline during discovery; set numeric targets with the school before pilot launch.

- Attendance recording completeness and time from class meeting to finalized record.
- Import acceptance, student-match rate, correction rate, duplicate rate, and time to resolve import exceptions.
- Teacher time to find a student history and complete a routine review.
- Staff-reported usefulness and trust in displayed metrics, with reasons for distrust tracked.
- Follow-up review completion and time to review, without optimizing for punitive outcomes.
- Access-control incidents, unauthorized data exposures, audit coverage, restore success, and accessibility defects.
- For any forecast: calibration, false-positive/false-negative rates, subgroup performance, drift, and staff override/review outcomes.

## 14. Recommended implementation order

1. Run policy/workflow discovery and define data ownership.
2. Design the production domain model and threat/privacy review; select hosting and identity approach.
3. Implement server persistence, authentication, tenant and class authorization, audit, and backups.
4. Build class/session/roster capture plus staged import and reconciliation.
5. Implement approved metric contracts and reconcile totals with school-approved examples.
6. Deliver teacher review, follow-up workflow, and approved reports; pilot in a small set of classes.
7. Expand descriptive analytics after data quality and operational trust are established.
8. Evaluate forecasting as a separate evidence-gated capability.


## 15. Pilot requirements decisions and specifications

These are concrete single-school pilot defaults. Policy-sensitive values require school owner sign-off before live records are used.

### 15.1 Role permissions

All permissions are enforced server-side and scoped to school and assigned classes. Technical administrators operate infrastructure but receive no student-record access by default.

| Capability | Faculty | Coordinator | Department head | Administrator |
|---|---|---|---|---|
| View attendance and student profiles | Assigned classes | Assigned program/classes | Assigned department/classes | School-wide |
| Take/correct marks | Assigned classes; reason required | Assigned scope; reason required | Assigned scope; reason required | Any class; reason required |
| Import attendance | Assigned classes | Assigned scope | Assigned scope | Any class |
| Acknowledge review flags | Assigned classes | Assigned scope | Assigned scope | Any class |
| View follow-up notes | Permitted assigned students | Assigned scope | Assigned scope | Authorized school scope |
| Generate reports/export student data | Assigned classes; logged | Assigned scope; logged | Assigned scope; logged | School-wide; logged |
| Manage policy, accounts, retention | No | No | No | Yes; audited |

### 15.2 Attendance calculation contract (policy version 1 proposal)

A session is one scheduled class meeting on the school calendar. Distinct meetings on a date have distinct session IDs. P=present, L=late, A=unexcused absent, E=excused, blank=unknown/not recorded. Rate is 100 × (P + L) / (P + L + A). Excused and blank are excluded from numerator and denominator; blanks are never inferred absent. Class rate aggregates counts before division. Display percentages round to nearest whole percent, half up; calculation retains full precision. Absence streaks count consecutive expected sessions marked A; P, L, E, or blank breaks the streak. Holidays/non-meetings are not sessions. The current matrix import has one date column per class/date and cannot represent two same-day sessions.

### 15.3 Import file contract

Pilot support is UTF-8 CSV, comma-delimited, optional BOM, maximum 5 MiB, 20,000 student rows, and 200 session columns. XLSX is deferred because the current application only parses CSV.

| Required field | Rule |
|---|---|
| Student Name | Non-empty display name, unique within the selected class for safe matching |
| Class/Section | Must resolve to an authorized class |
| Grade/Year Level | School-defined text/code |
| Session columns | ISO 8601 YYYY-MM-DD, unique per class |

Accepted values: P, A, L, E (case-insensitive); blank means unknown. Template:

```csv
Student Name,Grade/Year Level,2026-09-01,2026-09-03
Alex Tan,Year 7,P,L
Sam Lee,Year 7,A,E
```

Match by normalized name within the selected class. Duplicate names in the file or multiple existing matches block commit. Existing attendance marks for the same student/session are updated atomically and the change is audited. Invalid rows are rejected individually. Missing headers, empty/corrupt files, and size-limit violations block the file. Preview precedes commit. Partial commit is allowed only after rejected rows are shown and an authorized user confirms. Preserve source metadata and row outcomes.

### 15.4 Student identity and duplicate rules

Student fields: immutable UUID PK, display name, grade/year, active state, timestamps. Class membership is effective-dated enrollment. Duplicate names or multiple existing matches are blocked for staff resolution. Never auto-merge. Class movement does not rewrite historical attendance.

### 15.5 At-risk rules

Triggers are OR conditions evaluated over the selected period: rate strictly below 75% (74.99 qualifies, 75.00 does not), at least five consecutive A sessions, or more than eight A sessions (8 does not qualify; 9 qualifies). No denominator means no rate trigger. Thresholds are versioned; grade/program variations require an approved administrator policy. Show trigger, evidence, denominator, sessions, and policy version. A flag prompts human review only. Staff may acknowledge with actor/time/category; acknowledgement does not suppress an active flag. The active flag clears when no trigger remains; its history is retained.

### 15.6 Dashboard and profile

Cards show attendance rate with numerator/denominator, present, absent, late, excused, unrecorded, students monitored, and students flagged. Show selected class, term, date range, source, and freshness. Filters: authorized class/section, term, date range, status, and student-name search. Charts: session trend with denominator, P/A/L/E/blank distribution, and flag counts by reason. Each chart has an equivalent table, formula, and empty state. No records shows an explicit message and no fabricated zero-rate trend. Drill-down opens the corresponding filtered roster; student rows open profiles.

Profiles show name, class/section, grade, effective enrollment, period, rate/denominator, P/A/L/E/blank totals, complete dated history, selected-period trend, active flags/reasons, acknowledgement history, and permitted follow-ups. Record detail shows session, status, source, recorder, and correction history according to role.

### 15.7 Reports and exports

Class report contains school/class/section/grade, term/date range, generation time/timezone, freshness/source, policy/formula, student count, P/A/L/E/blank totals, aggregate rate/denominator, session trend and student roster with names, rates, counts, and review reasons. Individual report contains student name/class/grade/enrollment, period/time, formula/policy, rate/denominator, status totals, full session history, flags, and permitted follow-up status.

Filters include authorized school scope, class, term, date range, status, optional student. Faculty generate assigned-class reports; coordinators and department heads their assigned scope; administrators school-wide. PDF uses the report layout. Excel summary has Summary, Session Trend, and Roster sheets. Analytics CSV contains filtered session facts and metric definitions, excluding restricted notes. Filename: TalaTrack_<type>_<class-or-student>_<start>_<end>_<generated-UTC>.<ext>, with sanitized identifiers. Empty reports state no data and retain filters/time; empty CSV contains headers. All generation and exports are logged.

### 15.8 Relational database model

PostgreSQL is the chosen pilot database; DATABASE_URL is server-only. Use UUID PKs, school_id tenant scope, UTC timestamps, FK constraints, restrictive deletes, and indexes on school/class/date/student.

| Table | Fields and relationships |
|---|---|
| schools | id PK, name, timezone, locale |
| users | id PK, school_id FK, identity_provider_subject, name, email, active |
| user_roles | id PK, user_id FK, role, scope_type/id, effective dates |
| classes | id PK, school_id FK, academic_year, term, class_code, section, grade_level, subject |
| students | id PK, school_id FK, display_name, grade_level, active |
| enrollments | id PK, student_id FK, class_id FK, start_date, end_date |
| sessions | id PK, class_id FK, meeting_at, timezone, source, policy_version; unique(class_id, meeting_at) for pilot |
| attendance | id PK, session_id FK, student_id FK, status, recorded_by FK, recorded_at, updated_at, correction_reason, import_row_id FK; unique(session_id, student_id) |
| import_jobs | id PK, school_id FK, class_id FK, uploader_id FK, source_filename, checksum, schema_version, created_at, state |
| import_rows | id PK, job_id FK, row_number, student_id FK nullable, outcome, errors JSON, proposed_changes JSON |
| policies | id PK, school_id FK, version, effective_at, configuration JSON, approved_by FK |
| report_jobs | id PK, school_id FK, requester_id FK, report_type, filters JSON, policy_version, generated_at, format, state, artifact_reference |
| audit_events | id PK, school_id FK, actor_id FK, action, entity_type/id, before/after JSON, occurred_at, request_id |
| follow_ups | id PK, student_id FK, class_id FK, owner_id FK, status, category, restricted note, created_at |

School has many users/classes/students/policies/jobs. Class has many enrollments/sessions; student has many enrollments/marks/follow-ups; session has marks; import job has row results. Corrections update current mark transactionally and append prior value to immutable audit history.

### 15.9 Workflow and failure handling

Workflow: Upload → Validate → Process → Calculate → Dashboard → Monitor Students → Detect At-Risk → Generate Report → Export. Validation stages without mutating committed attendance. Blocking file errors show cause/template and preserve current data. Row issues show row, field, and correction steps. Failed transaction rolls back the selected commit and leaves job retryable. Computation failures preserve source records, show a traceable error ID, and do not label stale metrics current. Failed report jobs remain in history with retry guidance; export failure never marks delivery successful. Handle invalid type, missing columns, unknown student/class, invalid value/date, duplicate conflict, empty/corrupt/oversized file, failed calculation, and failed report generation. Do not send personal student information to client telemetry.

### 15.10 Technology and persistence decisions

Frontend: React/TypeScript/Vite. Backend: Node.js HTTP API (native HTTP server); Express and Laravel are not selected. PostgreSQL via server-only DATABASE_URL with ordered SQL migrations. Descriptive analytics use deterministic TypeScript over database-backed sessions. The existing class projection is an indicative linear baseline, not a validated predictive model; do not describe it as a forecast or expose student-level predictions until validation approval. PDF and Excel export libraries are not selected or implemented in the current release.

Committed records and import/report/audit metadata persist in PostgreSQL. School must approve legal retention; proposed pilot default is active enrollment plus two years. Encrypted daily backups, 35-day rolling retention, restore exercise before launch; target RPO <=24 hours and RTO <=1 business day. No production data until identity, policy, privacy, retention, and backup owners are approved.

### 15.11 Authentication and security

Current implementation uses school workspace registration and administrator-provisioned email/password accounts, scrypt password hashes, opaque server-side PostgreSQL sessions, HTTP-only SameSite cookies (Secure in production), origin checks for writes, login throttling, session expiry/revocation, logout, and server-side school/class scope checks. Password reset, email verification, MFA, delegated OIDC/SSO, invitation delivery, and recovery workflows remain production launch requirements. Keep TLS, encrypted backups, secret rotation, and deny-by-default authorization; changing an ID must never cross school or class scope.


### 15.12 Release status and remaining launch gates

The current application has PostgreSQL migrations, school signup, account login/logout, administrator-managed staff accounts and class assignments, database-backed attendance/import history, audit records, and descriptive analytics. Vercel serves the built React client and API function from one deployment origin. Existing records are not replaced by registration or migrations.

This is a deployable pilot foundation, not yet a complete commercial SaaS release. Before accepting live student records or charging schools, configure a production host and managed PostgreSQL service, restrict database credentials, enforce HTTPS and backups, implement email verification/password recovery and optional school SSO, complete privacy/retention and accessibility review, add paid-plan checkout/webhooks and subscription enforcement, and finish validated PDF/XLSX/report workflows. These require school policy decisions and external provider accounts/secrets. No predictive output should be marketed as validated; current analytics are descriptive and the class projection is exploratory.
### 15.13 Acceptance criteria

- Access: unauthenticated reads fail; every role/API/export is limited to assigned scope; revocation removes access; access changes are audited.
- Data: every mark has one student and session; duplicate student/session is rejected; blank differs from absent; correction retains previous value, actor, timestamp, and reason.
- Imports: template works; invalid type/date/ID/status, unknown student, duplicates, empty/corrupt/oversized files match specified behavior; preview equals committed changes; rollback restores prior values.
- Metrics: school-approved examples reproduce numerator/denominator and half-up display; late is attended, excused excluded, blank marks lower coverage but do not reduce the rate denominator; table equals chart; empty trends do not fabricate 0%; class projection requires six sessions with at least 60% roster coverage and states method/range/cadence.
- Risk: 74.99/75%, 8/9 absences, 4/5 consecutive absences verify boundaries; reasons are combined; acknowledgement is attributable and never hides active triggers.
- Views: dashboard filters apply consistently; drill-down retains scope; profile history equals source records; no-data state is explicit.
- Reports: required fields and filters appear; unauthorized generation is denied; empty behavior and filenames are correct; generation/export is attributable.
- Operations: imports, corrections, policy, roles, reports, and exports are auditable; verified restore meets RPO/RTO; retention follows approved schedule.
- Accessibility: keyboard, screen-reader labels, contrast, zoom/reflow, and chart/table equivalence pass on supported viewports.
