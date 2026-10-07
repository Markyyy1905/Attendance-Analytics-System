# CSV template and validation

The importer accepts UTF-8 CSV (optional BOM), up to 5 MiB, 20,000 student rows, and 200 session columns. XLSX is not supported.

The downloadable template contains class metadata followed by a header with `Student Name`, `Grade/Year Level`, and one ISO `YYYY-MM-DD` column per session. Class/section comes from the metadata row. A file can contain multiple section blocks; each is saved as a separate class workspace. Student names must be unique within a class. The database maintains a private internal UUID, but it is not shown or required in CSV files.

```csv
Subject Title,Mathematics
Subject Code,MATH-7
Term,Term 1
Course/Section,Year 7,7A
Student Name,Grade/Year Level,2026-09-01,2026-09-03
Alex Tan,Year 7,P,L
Sam Lee,Year 7,A,E
```

Accepted values are P (present), A (absent), L (late), E (excused), case-insensitive. Blank means unknown/not recorded and creates no attendance mark. Existing students are matched by normalized name within the selected class. Duplicate names within the file or multiple existing matches block the import so attendance is never merged ambiguously. Re-imported marks update the same class/session/student record atomically and record the change in audit history.

Attendance rate is `(present + late) / (present + late + absent)`. Excused and blank records are excluded. Percentages display as whole numbers, with half-up rounding. The streak rule counts consecutive expected sessions marked absent; blank, excused, present, and late break a streak.
