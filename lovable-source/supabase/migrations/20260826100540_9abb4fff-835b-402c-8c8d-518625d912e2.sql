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

CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a page view" ON public.page_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read page views" ON public.page_views FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX page_views_created_at_idx ON public.page_views (created_at DESC);
CREATE INDEX page_views_path_idx ON public.page_views (path);

CREATE OR REPLACE FUNCTION public.analytics_pageviews_daily(_days integer DEFAULT 30)
RETURNS TABLE (day date, views bigint)
LANGUAGE sql
STABLE
AS $$
  SELECT date_trunc('day', created_at)::date AS day, count(*) AS views
  FROM public.page_views
  WHERE created_at >= now() - (_days || ' days')::interval
  GROUP BY 1
  ORDER BY 1;
$$;
GRANT EXECUTE ON FUNCTION public.analytics_pageviews_daily(integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.analytics_top_paths(_days integer DEFAULT 30, _limit integer DEFAULT 8)
RETURNS TABLE (path text, views bigint)
LANGUAGE sql
STABLE
AS $$
  SELECT path, count(*) AS views
  FROM public.page_views
  WHERE created_at >= now() - (_days || ' days')::interval
  GROUP BY path
  ORDER BY views DESC
  LIMIT _limit;
$$;
GRANT EXECUTE ON FUNCTION public.analytics_top_paths(integer, integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.analytics_subscribers_daily(_days integer DEFAULT 30)
RETURNS TABLE (day date, signups bigint)
LANGUAGE sql
STABLE
AS $$
  SELECT date_trunc('day', created_at)::date AS day, count(*) AS signups
  FROM public.newsletter_subscribers
  WHERE created_at >= now() - (_days || ' days')::interval
  GROUP BY 1
  ORDER BY 1;
$$;
GRANT EXECUTE ON FUNCTION public.analytics_subscribers_daily(integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.analytics_subscribers_by_track()
RETURNS TABLE (track text, subscribers bigint)
LANGUAGE sql
STABLE
AS $$
  SELECT unnest(tracks) AS track, count(*) AS subscribers
  FROM public.newsletter_subscribers
  GROUP BY 1
  ORDER BY 2 DESC;
$$;
GRANT EXECUTE ON FUNCTION public.analytics_subscribers_by_track() TO authenticated;