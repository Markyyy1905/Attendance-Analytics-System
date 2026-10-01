# CSV template and validation

The importer reads UTF-8 CSV files matching the structure of the supplied `CSV.csv`. A file may repeat the metadata/header/student block for additional sections. Empty trailing columns and quoted names with commas are supported.

## Layout

1. Metadata rows: `Subject Title`, `Subject Code`, `Schedule (Day)`, `Schedule (Time)`, `Term`, and `Course/Section`.
2. Optional blank separator row.
3. Header row beginning with `Student`, followed by one date column per meeting.
4. One student per row. Each attendance date accepts `P`, `A`, `L`, or a blank.

The number of date columns and student rows is dynamic. The importer normalizes valid date cells for sorting and display. The starter file is available through **Download template** on the Import attendance screen.

## Validation

- A `Student` header and at least one dated column are required.
- At least one student row with a recorded mark is required.
- Valid marks are P (present), A (absent), and L (late); empty values are allowed.
- Unrecognized marks stop the import and report the affected row and date.
- Missing subject title is a warning. Other metadata is shown when supplied.
- This prototype accepts CSV only, up to 5 MB.

## Calculations

The attached brief does not supply a formula. The prototype uses present marks divided by all nonblank marks, rounds to the nearest whole percent, and reports late marks separately. The risk rules mirror the brief: rate below 75%, at least five consecutive absences, or more than eight total absences. Confirm formulas and rules with the institution before using real data.
