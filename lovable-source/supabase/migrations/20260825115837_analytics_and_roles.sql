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

-- Aggregation functions run as SECURITY INVOKER (the default), so RLS on the
-- underlying tables still restricts results to admins only.

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
