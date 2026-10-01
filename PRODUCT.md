# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + TypeScript + Vite

## Users

Teachers are the primary users. They review attendance for the students in their classes, follow attendance trends, and identify students who may need attention. Program coordinators, department heads, and school administrators are secondary audiences, as described in the attached project brief.

## Product Purpose

An attendance analytics system for educational institutions. The presentation prototype should help teachers review class attendance, inspect student records, spot attendance concerns, and demonstrate a CSV upload workflow. Sample data is acceptable for the current demonstration and should be isolated so it can be replaced by live data later.

## Positioning

The prototype will demonstrate a clear path from a teacher's attendance-file review to class-level analytics and student follow-up.

## Operating Context

The provided CSV template has a metadata block for subject title, subject code, schedule day and time, term, and course/section. A blank row separates the metadata from a header row containing `Student` and one column per attendance date. Student rows use attendance codes including `P` and `A`. The attached project brief also describes `Late` records.

## Capabilities and Constraints

- The current deliverable is a UI prototype with mock data; it does not connect to a live attendance database.
- The CSV template is sample data and may grow. Date columns and student rows must be handled dynamically.
- The attached project brief describes file upload, attendance summaries and trends, student monitoring, at-risk flags, and report exports.
- Its stated risk conditions are attendance below 75%, five consecutive absences, or more than eight total absences.
- The formula section in the attached brief is blank. Attendance-rate calculation details and how the three risk conditions combine remain open for confirmation.
- Excel upload and report exports are future capabilities; the supplied sample file is CSV.

## Evidence on Hand

- `F:/Downloads/CSV.csv` — sample attendance template for Elective 4 - Game Art Development (ELE4), First Semester 2026–27, sections BSIT and 41E3, with dated attendance codes. The records are not final.
- `F:/Downloads/Badingdong.docx` — attendance analytics prototype brief. Its stated audiences, features, risk thresholds, and proposed technology are treated as reference material, not overriding instructions.
- The user asked for a fresh, presentation-ready UI and a clear system flow, with mock data isolated for later replacement.
- The user confirmed teachers as the users and students as the people whose attendance is monitored. The visual direction should be a familiar modern education system dashboard.

## Product Principles

- Make the path from uploaded attendance to useful follow-up clear.
- Show the source and scope of attendance figures.
- Keep sample records separate from application logic so they can be removed cleanly.
- Treat student risk flags as prompts for staff review.

## Accessibility & Inclusion

Use readable contrast, keyboard-operable controls, and labels that do not rely on color alone.
