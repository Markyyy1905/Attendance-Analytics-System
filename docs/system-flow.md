# System flow

## Teacher journey

```text
Open class overview
       ↓
Import attendance CSV
       ↓
Parse and validate in browser
       ↓
Review file summary and student sample
       ↓
Apply dataset to this tab
       ↓
See updated attendance, analytics, and student flags
       ↓
Review a student profile and attendance history
```

## Import steps

1. The teacher selects or drops a CSV file (maximum 5 MB).
2. The importer reads the file in the browser. Nothing is uploaded to a server.
3. The parser reads each class's metadata rows and `Student` date header, combining as many section blocks, date columns, and student rows as the file contains.
4. The validator accepts `P`, `A`, `L`, and blank marks. It reports malformed marks and rows with no records before the teacher applies the data.
5. The preview shows course details, record counts, calculated rate, risk flags, and sample rows.
6. The teacher applies a valid file. The active dataset updates for the current tab.
7. Overview, Attendance, Students, and Analytics recalculate from the same dataset.

The teacher can reset to the illustrative dataset from the sidebar. Refreshing also loads demo data again.

## Attendance review

- **Overview** summarizes the selected class, attendance rate, student count, and flags. It links to the roster, trend detail, and file import.
- **Attendance** shows students as rows and dated marks as columns. The matrix can be searched and filtered by review status.
- **Students** provides a class roster and individual profile links.
- **Student profile** shows summary counts, rate, dated marks, and the reason for any flag.
- **Analytics** presents date trends and present, absent, and late totals.

## Risk review

The attached project brief says to flag attendance below 75%, five consecutive absences, or more than eight total absences. A flag prompts a teacher to review the student; it does not make an intervention decision for them.

The brief leaves the rate formula blank. For the demo, the rate is `P marks ÷ all nonblank marks`, and `L` marks are displayed as a separate total. Confirm the institutional formula and risk policy before connecting live records.
