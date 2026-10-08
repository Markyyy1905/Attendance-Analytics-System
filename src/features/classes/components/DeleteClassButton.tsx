import { useState } from "react";
export function DeleteClassButton({ id, name, onDelete }: { id:string; name:string; onDelete:(id:string)=>Promise<void> }) {
  const [confirm,setConfirm]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  async function remove() { setBusy(true);setError("");try { await onDelete(id); } catch(e) {setError(e instanceof Error?e.message:"Could not delete class.");setBusy(false);} }
  return <div>{confirm ? <div><p>Remove {name} from active workspaces? Its records will be retained.</p><button type="button" className="button button-secondary" disabled={busy} onClick={()=>void remove()}>{busy?"Deleting…":"Confirm deletion"}</button><button type="button" className="button button-secondary" disabled={busy} onClick={()=>setConfirm(false)}>Cancel</button></div> : <button type="button" className="button button-secondary" onClick={()=>setConfirm(true)}>Delete class</button>}{error&&<p role="alert">{error}</p>}</div>;
}
