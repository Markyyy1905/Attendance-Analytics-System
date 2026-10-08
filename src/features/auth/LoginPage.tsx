import { useState, type FormEvent } from "react";
import { useAttendanceData } from "../../app/providers/AttendanceDataProvider";
import "./LoginPage.css";

export function LoginPage() {
  const { signIn, signUp } = useAttendanceData();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    const values = new FormData(event.currentTarget);
    try {
      if (mode === "login") {
        await signIn(String(values.get("email")), String(values.get("password")));
      } else {
        const result = await signUp({
          name: String(values.get("name")),
          school: String(values.get("school")),
          email: String(values.get("email")),
          password: String(values.get("password")),
        });
        if (result.pendingApproval) {
          setNotice("Your account request was sent to this school’s administrator. You can sign in after it is approved.");
          setMode("login");
        }
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  function switchMode() {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setNotice("");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand" aria-label="TalaTrack"><img src="/talatrack-logo-transparent.png" alt="TalaTrack" /></div>
        <div className="auth-intro">
          <h1>{mode === "login" ? "Welcome back" : "Create a school workspace"}</h1>
          <p>{mode === "login" ? "Sign in to review attendance and class trends." : "Register your school workspace, or request to join an existing one."}</p>
        </div>
        {notice && <p className="auth-notice" role="status">{notice}</p>}
        <form onSubmit={(event) => void submit(event)} className="auth-form">
          {mode === "register" && <>
            <label>Your name<input name="name" autoComplete="name" minLength={2} maxLength={100} required /></label>
            <label>School name<input name="school" autoComplete="organization" minLength={2} maxLength={160} required /></label>
          </>}
          <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
          <label>Password<input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "login" ? 1 : 12} required />{mode === "register" && <small>Use at least 12 characters.</small>}</label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button button-primary auth-submit" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
        </form>
        <p className="auth-switch">{mode === "login" ? "New to TalaTrack?" : "Already have an account?"} <button type="button" onClick={switchMode}>{mode === "login" ? "Create an account" : "Sign in"}</button></p>
        <p className="auth-footnote">Using the exact name of an existing school sends an account request to its administrator. A new school name creates a workspace, but sign-up accounts do not have Staff & access permissions.</p>
      </section>
    </main>
  );
}
