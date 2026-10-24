CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (used by the send-contact edge function) can read/write.

CREATE INDEX contact_submissions_ip_created_idx ON public.contact_submissions (ip, created_at DESC);
