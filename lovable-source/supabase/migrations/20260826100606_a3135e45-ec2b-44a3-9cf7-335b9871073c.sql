CREATE OR REPLACE FUNCTION public.analytics_pageviews_daily(_days integer DEFAULT 30)
RETURNS TABLE (day date, views bigint)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT date_trunc('day', created_at)::date AS day, count(*) AS views
  FROM public.page_views
  WHERE created_at >= now() - (_days || ' days')::interval
  GROUP BY 1
  ORDER BY 1;
$$;

CREATE OR REPLACE FUNCTION public.analytics_top_paths(_days integer DEFAULT 30, _limit integer DEFAULT 8)
RETURNS TABLE (path text, views bigint)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT path, count(*) AS views
  FROM public.page_views
  WHERE created_at >= now() - (_days || ' days')::interval
  GROUP BY path
  ORDER BY views DESC
  LIMIT _limit;
$$;

CREATE OR REPLACE FUNCTION public.analytics_subscribers_daily(_days integer DEFAULT 30)
RETURNS TABLE (day date, signups bigint)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT date_trunc('day', created_at)::date AS day, count(*) AS signups
  FROM public.newsletter_subscribers
  WHERE created_at >= now() - (_days || ' days')::interval
  GROUP BY 1
  ORDER BY 1;
$$;

CREATE OR REPLACE FUNCTION public.analytics_subscribers_by_track()
RETURNS TABLE (track text, subscribers bigint)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT unnest(tracks) AS track, count(*) AS subscribers
  FROM public.newsletter_subscribers
  GROUP BY 1
  ORDER BY 2 DESC;
$$;