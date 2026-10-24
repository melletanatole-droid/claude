REVOKE SELECT ON public.profiles FROM anon;
DROP POLICY IF EXISTS "Profiles are readable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users read own profile or admin reads all" ON public.profiles;
CREATE POLICY "Users read own profile or admin reads all" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

DELETE FROM public.page_views WHERE path = '/pentest-injected';
DELETE FROM public.newsletter_subscribers WHERE email = 'pentest-proof@example.com';