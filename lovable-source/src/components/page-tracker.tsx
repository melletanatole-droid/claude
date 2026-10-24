import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { supabase } from "@/integrations/supabase/client";

export function PageTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return;

    supabase
      .from("page_views")
      .insert({ path: pathname, referrer: document.referrer || null })
      .then(({ error }) => {
        if (error) console.warn("[analytics] page view tracking failed:", error.message);
      });
  }, [pathname]);

  return null;
}
