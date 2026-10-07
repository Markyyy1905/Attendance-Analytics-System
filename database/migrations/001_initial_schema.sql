BEGIN;

CREATE TABLE schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  timezone text NOT NULL DEFAULT 'UTC',
  locale text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  identity_provider_subject text NOT NULL,
  display_name text NOT NULL,
  email text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, identity_provider_subject),
  UNIQUE (school_id, email)
);

CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  academic_year text NOT NULL,
  term text NOT NULL,
  class_code text NOT NULL,
  section text NOT NULL,
  grade_level text NOT NULL,
  subject text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, academic_year, term, class_code, section, subject)
);

CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  display_name text NOT NULL,
  grade_level text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, id)
);

CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  role text NOT NULL CHECK (role IN ('faculty','coordinator','department_head','administrator','technical_administrator')),
  scope_type text NOT NULL CHECK (scope_type IN ('school','class','department','program')),
  scope_id uuid,
  effective_from date NOT NULL DEFAULT CURRENT_DATE,
  effective_to date,
  CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  student_id uuid NOT NULL,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
  start_date date NOT NULL,
  end_date date,
  FOREIGN KEY (school_id, student_id) REFERENCES students(school_id, id) ON DELETE RESTRICT,
  CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  version integer NOT NULL,
  effective_at timestamptz NOT NULL,
  configuration jsonb NOT NULL,
  approved_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, version)
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
  meeting_at timestamptz NOT NULL,
  timezone text NOT NULL,
  source text NOT NULL,
  policy_id uuid REFERENCES policies(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (class_id, meeting_at),
  UNIQUE (school_id, id)
);

CREATE TABLE import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
  uploader_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  source_filename text NOT NULL,
  checksum text NOT NULL,
  schema_version text NOT NULL,
  state text NOT NULL CHECK (state IN ('staged','committed','failed','rolled_back')),
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  committed_at timestamptz
);

CREATE TABLE import_rows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES import_jobs(id) ON DELETE RESTRICT,
  row_number integer NOT NULL,
  student_id uuid REFERENCES students(id) ON DELETE RESTRICT,
  outcome text NOT NULL CHECK (outcome IN ('accepted','rejected','duplicate','updated')),
  errors jsonb NOT NULL DEFAULT '[]'::jsonb,
  proposed_changes jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (job_id, row_number)
);

CREATE TABLE attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  session_id uuid NOT NULL,
  student_id uuid NOT NULL,
  status char(1) NOT NULL CHECK (status IN ('P','A','L','E')),
  recorded_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  correction_reason text,
  import_row_id uuid REFERENCES import_rows(id) ON DELETE RESTRICT,
  FOREIGN KEY (school_id, session_id) REFERENCES sessions(school_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (school_id, student_id) REFERENCES students(school_id, id) ON DELETE RESTRICT,
  UNIQUE (session_id, student_id)
);

CREATE TABLE follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  student_id uuid NOT NULL,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE RESTRICT,
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status text NOT NULL,
  category text NOT NULL,
  restricted_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (school_id, student_id) REFERENCES students(school_id, id) ON DELETE RESTRICT
);

CREATE TABLE report_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  requester_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  report_type text NOT NULL,
  filters jsonb NOT NULL,
  policy_id uuid REFERENCES policies(id) ON DELETE RESTRICT,
  format text NOT NULL CHECK (format IN ('pdf','xlsx','csv')),
  state text NOT NULL CHECK (state IN ('queued','complete','failed')),
  artifact_reference text,
  generated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  actor_id uuid REFERENCES users(id) ON DELETE RESTRICT,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  request_id text,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX classes_school_term_idx ON classes (school_id, term);
CREATE INDEX students_school_name_idx ON students (school_id, display_name);
CREATE INDEX enrollments_class_dates_idx ON enrollments (class_id, start_date, end_date);
CREATE INDEX sessions_class_date_idx ON sessions (class_id, meeting_at);
CREATE INDEX attendance_student_session_idx ON attendance (student_id, session_id);
CREATE INDEX import_jobs_school_date_idx ON import_jobs (school_id, uploaded_at DESC);
CREATE INDEX report_jobs_school_date_idx ON report_jobs (school_id, generated_at DESC);
CREATE INDEX audit_events_school_date_idx ON audit_events (school_id, occurred_at DESC);

COMMIT;
