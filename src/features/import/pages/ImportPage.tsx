import { useRef, useState } from "react";
import { AlertCircle, ArrowRight, Check, CheckCircle2, CloudUpload, Download, FileSpreadsheet, RotateCcw, ShieldCheck, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAttendanceData } from "../../../app/providers/AttendanceDataProvider";
import { getDatasetSummary, getStatusForDate, getStudentMetrics } from "../../../shared/lib/attendanceMetrics";
import type { AttendanceDataset, CsvParseResult } from "../../../shared/types/attendance";
import { parseAttendanceCsv } from "../services/parseAttendanceCsv";
import { PageHeader } from "../../../components/ui/PageHeader";
import "./ImportPage.css";

const maxFileBytes = 5 * 1024 * 1024;

export function ImportPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { replaceDataset } = useAttendanceData();
  const [result, setResult] = useState<CsvParseResult | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [busy, setBusy] = useState(false);
  const [dropActive, setDropActive] = useState(false);
  const [applied, setApplied] = useState(false);
  const [fileError, setFileError] = useState("");

  async function loadFile(file?: File) {
    if (!file) return;
    setApplied(false);
    setFileError("");
    setResult(null);
    setFileName(file.name);
    setFileSize(file.size);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileError("This prototype reads CSV files. Choose a .csv file to continue.");
      return;
    }
    if (file.size > maxFileBytes) {
      setFileError("This file is larger than the 5 MB prototype limit. Choose a smaller CSV file.");
      return;
    }
    setBusy(true);
    try {
      const text = await file.text();
      setResult(parseAttendanceCsv(text, file.name));
    } catch {
      setFileError("We could not read this file. Check that it is a valid, plain-text CSV and try again.");
    } finally {
      setBusy(false);
    }
  }

  function downloadTemplate() {
    const contents = [
      ["Subject Title", "Course name"],
      ["Subject Code", "SUBJ101"],
      ["Schedule (Day)", "Wednesday"],
      ["Schedule (Time)", "9:00 AM - 10:30 AM"],
      ["Term", "First Semester", "2026-27"],
      ["Course/Section", "PROGRAM", "SECTION"],
      [],
      ["Student", "7/24/2026", "7/30/2026", "8/6/2026"],
      ["SAMPLE STUDENT", "P", "A", "L"],
    ].map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const blob = new Blob([`\uFEFF${contents}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "attendance-upload-template.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function applyImport(dataset: AttendanceDataset) {
    replaceDataset(dataset);
    setApplied(true);
  }

  const parsedDataset = result?.dataset;
  const summary = parsedDataset ? getDatasetSummary(parsedDataset) : null;

  return (
    <main className="page-import">
      <PageHeader title="Import attendance" description="Upload your class CSV, review the marks, and see how the system checks student attendance." actions={<button className="button button-secondary" onClick={downloadTemplate}><Download size={15} /> Download template</button>} />

      {applied ? <section className="import-success-panel">
        <div className="success-check"><Check size={23} /></div>
        <h2>Attendance data is ready</h2>
        <p><strong>{fileName}</strong> is now active in this browser tab. Dashboard, attendance records, student profiles, and analytics use the imported class data.</p>
        <div className="success-summary"><span>{summary?.students ?? parsedDataset?.students.length} student records</span><i /> <span>{parsedDataset?.dates.length} attendance dates</span><i /> <span>Session only</span></div>
        <div className="success-actions"><Link className="button button-primary" to="/dashboard">View dashboard <ArrowRight size={15} /></Link><button className="button button-secondary" onClick={() => { setApplied(false); setResult(null); setFileName(""); if (inputRef.current) inputRef.current.value = ""; }}><RotateCcw size={14} /> Import another file</button></div>
      </section> : <>
        <div className="import-flow-steps" aria-label="Import steps">
          <div className="import-step import-step-current"><span>1</span><div><strong>Choose file</strong><small>Select a CSV</small></div></div><i />
          <div className={`import-step ${result ? "import-step-current" : ""}`}><span>{result?.dataset ? <Check size={15} /> : "2"}</span><div><strong>Review data</strong><small>Check the preview</small></div></div><i />
          <div className={`import-step ${applied ? "import-step-current" : ""}`}><span>3</span><div><strong>Apply to demo</strong><small>Update this session</small></div></div>
        </div>

        <section className="panel import-upload-panel">
          <div className="panel-heading"><div><h2>Choose an attendance file</h2><p>CSV format · Maximum file size 5 MB</p></div><span className="panel-tag"><ShieldCheck size={14} /> Processed in this browser</span></div>
          <button className={`drop-zone ${dropActive ? "drop-zone-active" : ""}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDropActive(true); }} onDragLeave={() => setDropActive(false)} onDrop={(event) => { event.preventDefault(); setDropActive(false); void loadFile(event.dataTransfer.files[0]); }}>
            <span className="upload-icon"><CloudUpload size={24} /></span>
            <strong>Drop your CSV file here</strong><span>or <u>browse your files</u></span><small>CSV files only · Up to 5 MB</small>
          </button>
          <input ref={inputRef} className="sr-only" type="file" accept=".csv,text/csv" onChange={(event) => void loadFile(event.target.files?.[0])} />
          {busy && <div className="import-loading"><span className="loading-spinner" /> Reading and checking CSV…</div>}
          {fileError && <div className="import-error" role="alert"><AlertCircle size={17} /><span>{fileError}</span><button aria-label="Dismiss error" onClick={() => setFileError("")}><X size={15} /></button></div>}
          {fileName && !fileError && <div className="selected-file"><span className="selected-file-icon"><FileSpreadsheet size={17} /></span><div><strong>{fileName}</strong><span>{(fileSize / 1024).toFixed(1)} KB · {result ? "Checked" : "Ready to read"}</span></div>{result && (result.errors.length ? <span className="file-state file-state-error"><AlertCircle size={14} /> Needs review</span> : <span className="file-state file-state-success"><CheckCircle2 size={14} /> Valid CSV</span>)}</div>}
          <div className="format-help"><strong>Use the provided attendance format</strong><span>Metadata rows first, then a row with <code>Student</code> and one dated column per class. Marks can be P, A, L, or blank.</span></div>
        </section>

        {result && <section className="panel import-validation-panel">
          <div className="panel-heading"><div><h2>Validation results</h2><p>{result.dataset ? "Review the class details and a sample of records before applying this file." : "Resolve the flagged rows in your spreadsheet, then choose the CSV again."}</p></div><span className={result.errors.length ? "validation-chip validation-chip-error" : "validation-chip validation-chip-success"}>{result.errors.length ? `${result.errors.length} error${result.errors.length > 1 ? "s" : ""}` : <><Check size={13} /> Ready to import</>}</span></div>
          {result.errors.length > 0 && <div className="validation-list validation-list-errors">{result.errors.map((issue, index) => <div key={`${issue.row}-${index}`}><AlertCircle size={15} /><span><strong>Row {issue.row}:</strong> {issue.message}</span></div>)}</div>}
          {result.warnings.length > 0 && <div className="validation-list validation-list-warnings">{result.warnings.map((issue, index) => <div key={`${issue.row}-${index}`}><AlertCircle size={15} /><span><strong>Row {issue.row}:</strong> {issue.message}</span></div>)}</div>}
          {parsedDataset && summary && <>
            <div className="import-preview-meta"><div><span>Subject</span><strong>{parsedDataset.metadata.subjectTitle || "Not supplied"}</strong></div><div><span>Code / sections</span><strong>{[parsedDataset.metadata.subjectCode, parsedDataset.sections.join(", ")].filter(Boolean).join(" · ") || "Not supplied"}</strong></div><div><span>Term</span><strong>{parsedDataset.metadata.term || "Not supplied"}</strong></div></div>
            <div className="import-preview-summary"><div><strong>{parsedDataset.sections.length}</strong><span>sections</span></div><div><strong>{summary.students}</strong><span>student rows</span></div><div><strong>{summary.sessions}</strong><span>dates across sections</span></div><div><strong>{summary.attendanceRate}%</strong><span>present rate*</span></div><div><strong>{summary.atRisk}</strong><span>students flagged</span></div></div>
            <div className="import-preview-table-wrap"><table className="data-table import-preview-table"><thead><tr><th>Student</th><th>Section</th>{parsedDataset.dates.slice(0, 4).map((date) => <th key={date}>{date}</th>)}{parsedDataset.dates.length > 4 && <th>…</th>}<th>Rate</th><th>Flag</th></tr></thead><tbody>{parsedDataset.students.slice(0, 6).map((student) => { const metrics = getStudentMetrics(student); return <tr key={student.id}><td>{student.name}</td><td>{student.section}</td>{parsedDataset.dates.slice(0, 4).map((date) => { const status = getStatusForDate(student, date); return <td key={`${student.id}-${date}`}><span className={`preview-mark preview-mark-${status.toLowerCase()}`}>{status || "—"}</span></td>; })}{parsedDataset.dates.length > 4 && <td>…</td>}<td>{metrics.attendanceRate}%</td><td>{metrics.riskReasons.length ? <span className="preview-risk">Review</span> : <span className="preview-clear">On track</span>}</td></tr>; })}</tbody></table></div>
            <div className="import-preview-footer"><span>* Demo formula: P marks ÷ all recorded marks. Imported data replaces the current class data until this tab is refreshed.</span><button className="button button-primary" onClick={() => applyImport(parsedDataset)}>Apply dataset to this session <ArrowRight size={15} /></button></div>
          </>}
        </section>}
      </>}
    </main>
  );
}
