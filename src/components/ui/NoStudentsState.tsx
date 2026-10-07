import { FileUp, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import "./NoStudentsState.css";

export function NoStudentsState({ description = "Upload your class attendance CSV to add student records to this workspace." }: { description?: string }) {
  return (
    <div className="no-students-state">
      <span className="no-students-icon"><UsersRound size={22} /></span>
      <div>
        <h2>Start tracking your students' performance.</h2>
        <p>{description}</p>
      </div>
      <Link className="button button-primary" to="/import"><FileUp size={16} /> Upload CSV now</Link>
    </div>
  );
}
