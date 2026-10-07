import type {
  AttendanceCode,
  AttendanceDataset,
  AttendanceMetadata,
  AttendanceStudent,
  CsvParseResult,
} from "../../../shared/types/attendance";

interface CsvRow { values: string[]; line: number }
interface ClassBlock {
  metadata: AttendanceMetadata;
  columns: Array<{ date: string; columnIndex: number }>;
  idColumnIndex: number | null;
  nameColumnIndex: number;
  gradeColumnIndex: number | null;
  students: AttendanceStudent[];
}

const metadataFields = new Set(["subjecttitle", "subjectcode", "scheduleday", "scheduletime", "term", "coursesection"]);
const emptyMetadata = (): AttendanceMetadata => ({
  subjectTitle: "", subjectCode: "", term: "", program: "", section: "", scheduleDays: [], scheduleTimes: [],
});

function readRows(input: string): CsvRow[] {
  const rows: CsvRow[] = [];
  const source = input.replace(/^\uFEFF/, "");
  let values: string[] = [];
  let cell = "";
  let quoted = false;
  let line = 1;
  let rowLine = 1;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (character === '"') {
      if (quoted && source[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      values.push(cell.trim());
      cell = "";
    } else if (character === "\n" || character === "\r") {
      const breakLength = character === "\r" && source[index + 1] === "\n" ? 2 : 1;
      if (quoted) {
        cell += "\n";
        line += 1;
      } else {
        values.push(cell.trim());
        if (values.some(Boolean)) rows.push({ values, line: rowLine });
        values = [];
        cell = "";
        line += 1;
        rowLine = line;
      }
      if (breakLength === 2) index += 1;
    } else {
      cell += character;
    }
  }
  values.push(cell.trim());
  if (values.some(Boolean)) rows.push({ values, line: rowLine });
  return rows;
}

function hasUnclosedQuote(input: string) {
  const source = input.replace(/^\uFEFF/, "");
  let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] !== '"') continue;
    if (quoted && source[index + 1] === '"') index += 1;
    else quoted = !quoted;
  }
  return quoted;
}

function keyOf(value: string) { return value.toLowerCase().replace(/[^a-z0-9]/g, ""); }

function toDateKey(value: string): string | null {
  const usDate = /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/.exec(value.trim());
  if (usDate) {
    const year = Number(usDate[3].length === 2 ? `20${usDate[3]}` : usDate[3]);
    const month = Number(usDate[1]);
    const day = Number(usDate[2]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    return date.toISOString().slice(0, 10);
  }
  if (!/^\d{4}-\d{1,2}-\d{1,2}(?:$|T)/.test(value.trim())) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

function setMetadata(metadata: AttendanceMetadata, row: string[]) {
  const values = row.slice(1).filter(Boolean);
  switch (keyOf(row[0] ?? "")) {
    case "subjecttitle": metadata.subjectTitle = values[0] ?? ""; break;
    case "subjectcode": metadata.subjectCode = values[0] ?? ""; break;
    case "term": metadata.term = values.join(" "); break;
    case "scheduleday": metadata.scheduleDays = values; break;
    case "scheduletime": metadata.scheduleTimes = values; break;
    case "coursesection": metadata.program = values[0] ?? ""; metadata.section = values[1] ?? values[0] ?? ""; break;
  }
}

function unique(values: string[]) { return [...new Set(values.filter(Boolean))]; }

export function parseAttendanceCsv(text: string, sourceName = "attendance.csv"): CsvParseResult {
  if (!text.trim()) return { dataset: null, errors: [{ row: 1, message: "The file is empty. Add a header and at least one student row." }], warnings: [] };
  if (hasUnclosedQuote(text)) return { dataset: null, errors: [{ row: 1, message: "The CSV has an unclosed quoted field. Correct the file and try again." }], warnings: [] };
  const rows = readRows(text);
  const errors: CsvParseResult["errors"] = [];
  const warnings: CsvParseResult["warnings"] = [];
  if (rows.length > 20_000) return { dataset: null, errors: [{ row: 20_001, message: "The file exceeds the 20,000-row limit." }], warnings };
  const blocks: ClassBlock[] = [];
  let metadata = emptyMetadata();
  let currentBlock: ClassBlock | null = null;

  const closeBlock = () => {
    if (currentBlock) blocks.push(currentBlock);
    currentBlock = null;
  };

  for (const row of rows) {
    const label = keyOf(row.values[0] ?? "");
    if (metadataFields.has(label)) {
      if (currentBlock && (label === "subjecttitle" || label === "coursesection")) {
        closeBlock();
        metadata = emptyMetadata();
      }
      setMetadata(metadata, row.values);
      continue;
    }

    if (["student", "studentname", "name", "studentid"].includes(label)) {
      closeBlock();
      const idIndex = row.values.findIndex((value) => keyOf(value) === "studentid");
      const nameIndex = row.values.findIndex((value) => ["student", "studentname", "name"].includes(keyOf(value)));
      const nameColumnIndex = nameIndex >= 0 ? nameIndex : 0;
      const gradeColumnIndex = row.values.findIndex((value) => ["grade", "gradeyearlevel", "yearlevel"].includes(keyOf(value)));
      const idColumnIndex = idIndex >= 0 ? idIndex : null;
      const hasNamedColumns = nameIndex >= 0 && (idColumnIndex !== null || gradeColumnIndex >= 0);
      const datedColumns = row.values.flatMap((value, index) => {
        if (index === idColumnIndex || index === nameColumnIndex || index === gradeColumnIndex || !value) return [];
        return [{ value, date: toDateKey(value), columnIndex: index }];
      });
      if (datedColumns.length > 200) errors.push({ row: row.line, message: "The file exceeds the 200-session-column limit." });
      const invalidDates = datedColumns.filter((column) => !column.date || (hasNamedColumns && !/^\d{4}-\d{2}-\d{2}$/.test(column.value)));
      if (invalidDates.length) {
        errors.push({ row: row.line, message: `Attendance column â€œ${invalidDates[0].value}â€ is not a recognized date.` });
      }
      const dates = datedColumns.flatMap((column) => column.date ? [column.date] : []);
      if (unique(dates).length !== dates.length) errors.push({ row: row.line, message: "This section has duplicate attendance dates in its header." });
      if (!dates.length) {
        errors.push({ row: row.line, message: "The Student header needs at least one valid attendance date." });
        continue;
      }
      currentBlock = {
        metadata: { ...metadata },
        columns: datedColumns.flatMap((column) => column.date ? [{ date: column.date, columnIndex: column.columnIndex }] : []),
        idColumnIndex,
        nameColumnIndex,
        gradeColumnIndex: gradeColumnIndex >= 0 ? gradeColumnIndex : null,
        students: [],
      };
      continue;
    }

    const name = row.values[currentBlock?.nameColumnIndex ?? 0]?.trim();
    if (!name || !currentBlock) continue;
    const studentId = currentBlock.idColumnIndex === null ? "" : (row.values[currentBlock.idColumnIndex] ?? "").trim();
    const duplicateStudent = currentBlock.students.some((student) =>
      studentId ? student.id === studentId : student.name.trim().toLocaleLowerCase() === name.toLocaleLowerCase(),
    );
    if (duplicateStudent) {
      errors.push({ row: row.line, message: `${name}: duplicate student name in this class block; resolve duplicate names before saving.` });
      continue;
    }
    const sessionCells = currentBlock.columns.map((column) => (row.values[column.columnIndex] ?? "").trim().toUpperCase());
    const nonDateColumns = [currentBlock.idColumnIndex, currentBlock.nameColumnIndex, currentBlock.gradeColumnIndex].filter((index): index is number => index !== null);
    const lastDateColumn = Math.max(...currentBlock.columns.map((column) => column.columnIndex));
    const extraMarks = row.values.flatMap((value, index) => index > lastDateColumn && !nonDateColumns.includes(index) && value ? [value] : []);
    const invalid = sessionCells.findIndex((status) => status && !["P", "A", "L", "E"].includes(status));
    if (extraMarks.length) {
      errors.push({ row: row.line, message: `${name}: found an extra value after the dated attendance columns.` });
      continue;
    }
    if (invalid >= 0) {
      errors.push({ row: row.line, message: `${name}: use P, A, L, E, or leave a date blank (invalid mark in ${currentBlock.columns[invalid].date}).` });
      continue;
    }
    if (!sessionCells.some(Boolean)) {
      warnings.push({ row: row.line, message: `${name}: no attendance marks found; blank sessions remain unrecorded.` });
    }

    const sessions = currentBlock.columns.map((column, index) => ({
      date: column.date,
      status: (sessionCells[index] || "") as AttendanceCode | "",
    })).sort((a, b) => a.date.localeCompare(b.date));
    currentBlock.students.push({
      id: studentId || `import-${row.line}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name,
      gradeLevel: currentBlock.gradeColumnIndex === null ? undefined : row.values[currentBlock.gradeColumnIndex]?.trim(),
      program: currentBlock.metadata.program,
      section: currentBlock.metadata.section,
      subjectTitle: currentBlock.metadata.subjectTitle,
      subjectCode: currentBlock.metadata.subjectCode,
      term: currentBlock.metadata.term,
      sessions,
    });
  }
  closeBlock();

  const validBlocks = blocks.filter((block) => block.students.length > 0);
  if (!validBlocks.length) errors.push({ row: 1, message: "No student rows were found." });

  validBlocks.forEach((block) => {
    if (!block.metadata.subjectTitle) warnings.push({ row: 1, message: `Section ${block.metadata.section || "(unspecified)"}: subject title is missing.` });
  });

  const sections = unique(validBlocks.map((block) => block.metadata.section || block.metadata.program || "Unassigned"));
  const titles = unique(validBlocks.map((block) => block.metadata.subjectTitle));
  const codes = unique(validBlocks.map((block) => block.metadata.subjectCode));
  const terms = unique(validBlocks.map((block) => block.metadata.term));
  const programs = unique(validBlocks.map((block) => block.metadata.program));
  const datasetDates = unique(validBlocks.flatMap((block) => block.columns.map((column) => column.date))).sort();
  const firstMetadata = validBlocks[0]?.metadata ?? emptyMetadata();
  const combinedMetadata: AttendanceMetadata = {
    ...firstMetadata,
    subjectTitle: titles.length > 1 ? "Multiple subjects" : titles[0] ?? "",
    subjectCode: codes.length > 1 ? codes.join(" Â· ") : codes[0] ?? "",
    term: terms.length > 1 ? "Multiple terms" : terms[0] ?? "",
    program: programs.join(" Â· "),
    section: sections.length > 1 ? `${sections.length} sections` : sections[0] ?? "",
    scheduleDays: unique(validBlocks.flatMap((block) => block.metadata.scheduleDays)),
    scheduleTimes: unique(validBlocks.flatMap((block) => block.metadata.scheduleTimes)),
  };
  const students = validBlocks.flatMap((block) => block.students);
  const dataset: AttendanceDataset = {
    metadata: combinedMetadata,
    sections,
    dates: datasetDates,
    students,
    sourceName,
    importedAt: new Date().toISOString(),
  };

  return { dataset: errors.length ? null : dataset, errors, warnings };
}
