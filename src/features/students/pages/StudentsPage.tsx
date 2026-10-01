import {
  Download,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "../../../components/ui/Avatar";
import { RiskBadge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card, SectionHeader } from "../../../components/ui/Card";
import { Dropdown } from "../../../components/ui/Dropdown";
import { useStudents } from "../hooks/useStudents";
export function StudentsPage() {
  const navigate = useNavigate();
  const { data = [] } = useStudents();
  const [search, setSearch] = useState("");
  const filteredStudents = data.filter((student) => `${student.name} ${student.id} ${student.program} ${student.section}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <main className="content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Workspace / Students</p>
          <h1>Students</h1>
          <p className="heading-copy">
            Monitor individual attendance and act before small gaps become
            patterns.
          </p>
        </div>
        <div className="heading-actions">
          <Button variant="secondary">
            <Download size={16} /> Export list
          </Button>
          <Button>
            <Users size={16} /> Add student
          </Button>
        </div>
      </div>
      <div className="filter-strip">
        <div className="search-field">
          <Search size={16} />
          <input
            aria-label="Search students"
            placeholder="Search students, ID, or program"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Dropdown label="All risk levels" options={[{ label: "All risk levels", value: "all" }, { label: "Good standing", value: "good" }, { label: "Monitoring", value: "monitoring" }, { label: "At risk", value: "at_risk" }, { label: "Critical", value: "critical" }]} />
        <Dropdown label="Filters" options={[{ label: "All programs", value: "program" }, { label: "All sections", value: "section" }, { label: "All year levels", value: "year" }]} icon={<SlidersHorizontal size={14} />} />
      </div>
      <Card>
        <SectionHeader
          title="All students"
          subtitle="1,248 active students across 24 sections."
        />
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Program / section</th>
                <th>Attendance</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Risk status</th>
                <th>Last attendance</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="row-link"
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest("a"))
                      navigate(`/app/students/${student.id}`);
                  }}
                >
                  <td>
                    <div className="student-cell">
                      <Avatar initials={student.initials} />
                      <div>
                        <Link to={`/app/students/${student.id}`}>
                          <strong>{student.name}</strong>
                        </Link>
                        <span>
                          {student.id} · {student.program}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{student.section}</td>
                  <td>{student.attendanceRate}%</td>
                  <td>{Math.round(student.attendanceRate * 1.18)}</td>
                  <td>{student.absences}</td>
                  <td>
                    <RiskBadge level={student.riskLevel} />
                  </td>
                  <td>{student.lastAttendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
