# Product Requirements Document: Attendwise

**Status:** Draft for school discovery  
**Product:** Teacher-facing attendance monitoring and analytics system  
**Current baseline:** React + TypeScript browser prototype with illustrative data and CSV import  
**Document owner:** Product / School implementation team

## 1. Summary

Attendwise helps teachers and authorized school staff maintain reliable attendance records, understand class and student attendance patterns, and follow up with students who may need support. It should turn trusted attendance data into transparent, explainable summaries and timely human review. Analytics and predictions are decision support; staff remain responsible for interpreting context and choosing interventions.

The repository currently demonstrates a useful prototype flow: import CSV, validate and preview it, then inspect a dashboard, attendance matrix, student roster/profile, and descriptive analytics. It is not ready for operational school use. Data exists only in browser memory, there is no authentication or authorization, imports replace the whole active dataset, and the risk formula is explicitly a demo assumption. The next product milestone should be a secure, auditable pilot for one school and its agreed attendance workflow before adding predictive models.

## 2. Problem and opportunity

Teachers need to see whether students are attending, spot changes early, and act on reliable evidence without manually reconciling spreadsheets. Coordinators and administrators need consistent views across classes and terms. Today’s prototype demonstrates the review experience but does not yet provide authoritative records, ongoing updates, collaboration, intervention tracking, or trustworthy predictive analytics.

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

### Existing strengths to retain

- Coherent teacher-oriented journey across overview, attendance matrix, roster, profile, analytics, and CSV import.
- Demo records are isolated behind a repository adapter and clearly described as illustrative.
- CSV is parsed in the browser, with preview, row-level errors, warnings, and a downloadable template.
- Views share a common dataset and calculations, and risk flags are presented as prompts for review.
- The UI pairs attendance status colors with status letters/text and includes responsive layout intent.

### Release-blocking gaps for school use

- No identity, sign-in, session security, school tenancy, or server-side authorization.
- No durable system of record, backup/recovery, concurrent updates, or multi-user collaboration.
- No class picker or independent class datasets; an import replaces the active dataset for the entire tab.
- No authoritative student identifiers. Roster identifiers are synthesized from demo order or CSV row number.
- No supported attendance-taking/editing workflow, correction reason, approval, or audit history.
- Formula and policy behavior are provisional: late treatment, excused absences, partial days, enrollment windows, holidays, and threshold boundaries are not configured.
- Analytics are descriptive only; there is no forecasting, model validation, confidence, or drift monitoring.
- No generated reports/export, recurring import history, integration, or import reconciliation for existing records.
- No documented privacy, retention, incident response, accessibility conformance, or production operations plan.

### Implementation-specific concerns to resolve

- `getStudentMetrics` treats late as not present for the demo rate and counts absences over all recorded marks. Those choices can materially change school decisions and need a versioned, approved definition.
- The consecutive-absence calculation follows CSV date order and resets at blank marks. A blank may mean unknown, not a break in an absence streak; the calendar and expected sessions must define this.
- A date appearing in one section but not another is omitted from the other student's sessions; aggregating present/recorded can produce misleading comparisons when section schedules differ.
- Slash-form dates are interpreted as month/day/year, which is ambiguous for many locales. Imports need explicit locale/format and strict date validation.
- The imported dataset is applied wholesale, without duplicate detection, student matching, previewed updates, or rollback.
- A CSV row number is exposed as a student identifier in the roster; this is not a stable identity and should not be presented as one.
- Charts expose a summary label but need an equivalent accessible data table and clear handling of no data / one point / incomplete periods.

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
- Match on a school-approved stable identifier; never use student name or spreadsheet row number as the sole production key.
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
- Student with stable school identifier and effective-dated enrollment/class membership.
- Class meeting/session with date, timezone, expected roster context, and source.
- Attendance mark with status, actor, recorded/updated timestamps, correction reason, and source/import reference.
- Import job, file metadata, row-level result, and audit events.
- Versioned attendance policy and (when applicable) follow-up record.

### Metric contract

The school must approve and version the formula before operational use. Every displayed rate must define: included statuses in numerator and denominator; handling of late, excused, school activity, partial day, unknown and missing; expected sessions; enrollment start/end; rounding; reporting period; and timezone. “Attendance rate” must not silently mean different things in different views.

The existing prototype's `present / recorded marks` and risk rules (below 75%, at least five consecutive absences, more than eight absences) are placeholders from the brief, not approved policy. Define whether thresholds are inclusive, whether any rule independently triggers review, how blanks/holidays affect streaks, whether thresholds vary by age/program, and who may change them.

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

1. What is the official system of record and is Attendwise read-only, a capture tool, or both?
2. Which identity provider and roles/groups should supply access? What class assignment is authoritative?
3. What statuses are supported and how do late, excused, school activity, partial-day, and unknown marks affect rates?
4. What is the official attendance formula and reporting period? How are enrollment changes and missing sessions treated?
5. Are the brief's risk thresholds approved? Are they independent triggers, inclusive at boundary, and consistent across grades/programs?
6. What calendar, timezone, locale, and date formats apply? Which date is the authoritative session date?
7. What import sources and stable student identifiers exist? How are conflicts, corrections, and duplicates resolved?
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

