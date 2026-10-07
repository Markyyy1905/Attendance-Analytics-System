# System flow

```text
Upload ? Validate ? Preview ? Split by class/section ? Commit to PostgreSQL ? Select teacher workspace/class ? Calculate ? Dashboard ? Monitor students ? Detect review flags ? Analyze trends / class projection
```

1. Staff selects the provided CSV template and uploads a file.
2. The browser checks file type and size, headers, ISO dates, duplicate student names, and attendance values.
3. It shows row-level errors and warnings with an attendance preview. Invalid files cannot be committed.
4. Staff commits the valid preview. The local API separates each section block, then writes import metadata, student, class assignment, session, attendance, and audit records in one PostgreSQL transaction.
5. If the transaction fails, PostgreSQL rolls back the commit and the UI reports that the data was not saved.
6. The teacher workspace shows class assignments. Selecting a class loads only that class's PostgreSQL records; refresh reloads the selected records. There is no mock-data fallback.
7. Rate is (P + L) / (P + L + A); excused and blank are excluded from its denominator. Coverage counts known statuses separately so missing records remain visible. Review flags explain the evidence for each OR condition. Trends include eligible denominators, coverage, and weekday summaries. A recency-weighted class projection is shown only with at least six sessions and 60% roster coverage, with a 90% planning interval; it is not a validated prediction.

An empty database shows an explicit empty state and prompts staff to import attendance. If the API or database is unreachable, the UI reports the connection failure and does not substitute sample records.

The API is restricted to loopback for local development. Teacher/class assignment currently organizes local workspaces but does not authenticate the selected teacher. Identity, enforceable authorization, production hosting, and privacy operations are required before using school records outside local development.
