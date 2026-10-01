import { Download, Filter, Search, Upload } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card, SectionHeader } from "../../../components/ui/Card";
import { Dropdown } from "../../../components/ui/Dropdown";
import { useAttendanceRecords } from "../hooks/useAttendanceRecords";
export function AttendanceRecordsPage() {
  const { data = [] } = useAttendanceRecords();
  const [search, setSearch] = useState("");
  const filteredRecords = data.filter((record) => `${record.studentName} ${record.course} ${record.section} ${record.status}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <main className="content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Attendance / Records</p>
          <h1>Attendance records</h1>
          <p className="heading-copy">
            Review, filter, and correct attendance activity across your
            institution.
          </p>
        </div>
        <div className="heading-actions">
          <Button variant="secondary">
            <Download size={16} /> Export
          </Button>
          <Button>
            <Upload size={16} /> Upload attendance
          </Button>
        </div>
      </div>
      <div className="filter-strip">
        <div className="search-field">
          <Search size={16} />
          <input
            aria-label="Search attendance records"
            placeholder="Search records, students, or sections"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Dropdown label="This month" options={[{ label: "This month", value: "month" }, { label: "This week", value: "week" }, { label: "This semester", value: "semester" }]} />
        <Dropdown label="More filters" options={[{ label: "All statuses", value: "status" }, { label: "All courses", value: "course" }, { label: "All sections", value: "section" }]} icon={<Filter size={14} />} />
      </div>
      <Card>
        <SectionHeader
          title="Recent records"
          subtitle="Most recently updated attendance entries."
        />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Course</th>
                <th>Section</th>
                <th>Status</th>
                <th>Time in</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.studentName}</td>
                  <td>{record.course}</td>
                  <td>{record.section}</td>
                  <td>
                    <StatusBadge status={record.status} />
                  </td>
                  <td>{record.timeIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
