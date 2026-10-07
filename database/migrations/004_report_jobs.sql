BEGIN;

-- Some existing pilot databases were created from a partial schema before
-- report logging was added. Keep report generation available on those DBs.
CREATE TABLE IF NOT EXISTS report_jobs (
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

CREATE INDEX IF NOT EXISTS report_jobs_school_date_idx
  ON report_jobs (school_id, generated_at DESC);

COMMIT;
