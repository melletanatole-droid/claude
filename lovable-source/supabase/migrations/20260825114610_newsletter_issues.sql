CREATE TABLE public.newsletter_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  content text NOT NULL DEFAULT '',
  track text NOT NULL DEFAULT 'all' CHECK (track IN ('all', 'pratique', 'demain', 'actu')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent')),
  sent_at timestamptz,
  recipient_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_issues TO authenticated;
GRANT ALL ON public.newsletter_issues TO service_role;
ALTER TABLE public.newsletter_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authors and admins read newsletters" ON public.newsletter_issues FOR SELECT TO authenticated
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authors can create newsletters" ON public.newsletter_issues FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id AND (public.has_role(auth.uid(), 'author') OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Authors update own draft newsletters" ON public.newsletter_issues FOR UPDATE TO authenticated
  USING ((auth.uid() = author_id AND status = 'draft') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK ((auth.uid() = author_id AND status = 'draft') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authors delete own draft newsletters" ON public.newsletter_issues FOR DELETE TO authenticated
  USING ((auth.uid() = author_id AND status = 'draft') OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX newsletter_issues_status_idx ON public.newsletter_issues (status, created_at DESC);

CREATE TRIGGER newsletter_issues_set_updated_at BEFORE UPDATE ON public.newsletter_issues
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
