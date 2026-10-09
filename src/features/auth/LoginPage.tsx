import { useState, type FormEvent } from "react";
import { useAttendanceData } from "../../app/providers/AttendanceDataProvider";
import "./LoginPage.css";

type AuthField = "name" | "school" | "email" | "password";
type FieldErrors = Partial<Record<AuthField, string>>;

function getFieldErrors(data: FormData, mode: "login" | "register"): FieldErrors {
  const errors: FieldErrors = {};
  const name = String(data.get("name") || "").trim();
  const school = String(data.get("school") || "").trim();
  const email = String(data.get("email") || "").trim();
  const password = String(data.get("password") || "");

  if (mode === "register") {
    if (name.length < 2) errors.name = "Enter your name (at least 2 characters).";
    else if (name.length > 100) errors.name = "Your name must be 100 characters or fewer.";
    if (school.length < 2) errors.school = "Enter your school name (at least 2 characters).";
    else if (school.length > 160) errors.school = "Your school name must be 160 characters or fewer.";
  }
  if (!email) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address, such as name@school.edu.";
  if (!password) errors.password = "Enter your password.";
  else if (mode === "register" && password.length < 12) errors.password = "Use at least 12 characters for your password.";
  else if (mode === "register" && password.length > 200) errors.password = "Your password must be 200 characters or fewer.";

  return errors;
}

function getAuthErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
  if (/email or password is incorrect/i.test(message)) return "The email or password doesn’t match. Check both and try again.";
  if (/more than one workspace has that name/i.test(message)) return "We found more than one workspace with that school name. Ask your school administrator to create your staff account.";
  if (/account already exists/i.test(message)) return "An account already exists for this email in that school. Try signing in or ask your administrator for help.";
  if (/too many workspace registrations/i.test(message)) return "There have been too many registration attempts. Please try again later.";
  if (/too many sign-in attempts/i.test(message)) return "There have been too many sign-in attempts. Please try again later.";
  if (/request origin is not allowed/i.test(message)) return "This signup request came from an unrecognized site. Open TalaTrack from your school’s approved link and try again.";
  return message;
}

export function LoginPage() {
  const { signIn, signUp } = useAttendanceData();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setFieldErrors({});
    const data = new FormData(event.currentTarget);
    const nextFieldErrors = getFieldErrors(data, mode);
    if (Object.keys(nextFieldErrors).length) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setBusy(true);
    try {
      if (mode === "login") {
        await signIn(String(data.get("email")).trim(), String(data.get("password")));
      } else {
        const result = await signUp({
          name: String(data.get("name")).trim(),
          school: String(data.get("school")).trim(),
          email: String(data.get("email")).trim(),
          password: String(data.get("password")),
        });
        if (result.pendingApproval) {
          setNotice("Your account request was sent to this school’s administrator. You can sign in after it is approved.");
          setMode("login");
        }
      }
    } catch (cause) {
      setError(getAuthErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  function fieldProps(name: AuthField) {
    return {
      "aria-invalid": Boolean(fieldErrors[name]),
      "aria-describedby": fieldErrors[name] ? `${name}-error` : undefined,
      onChange: () => setFieldErrors((current) => ({ ...current, [name]: undefined })),
    };
  }

  function fieldError(name: AuthField) {
    return fieldErrors[name] ? <small className="auth-field-error" id={`${name}-error`} role="alert">{fieldErrors[name]}</small> : null;
  }

  function switchMode() {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setNotice("");
    setFieldErrors({});
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
        <form onSubmit={(event) => void submit(event)} className="auth-form" noValidate>
          {mode === "register" && <>
            <label>Your name<input {...fieldProps("name")} name="name" autoComplete="name" maxLength={100} />{fieldError("name")}</label>
            <label>School name<input {...fieldProps("school")} name="school" autoComplete="organization" maxLength={160} />{fieldError("school")}</label>
          </>}
          <label>Email address<input {...fieldProps("email")} name="email" type="email" autoComplete="email" />{fieldError("email")}</label>
          <label>Password<input {...fieldProps("password")} name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} />{mode === "register" && !fieldErrors.password && <small>Use at least 12 characters.</small>}{fieldError("password")}</label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button button-primary auth-submit" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
        </form>
        <p className="auth-switch">{mode === "login" ? "New to TalaTrack?" : "Already have an account?"} <button type="button" onClick={switchMode}>{mode === "login" ? "Create an account" : "Sign in"}</button></p>
        <p className="auth-footnote">Using the exact name of an existing school sends an account request to its administrator. A new school name creates a workspace, but sign-up accounts do not have Staff &amp; access permissions.</p>
      </section>
    </main>
  );
}
