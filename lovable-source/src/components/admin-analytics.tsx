import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { supabase } from "@/integrations/supabase/client";

const TRACK_LABELS: Record<string, string> = {
  pratique: "Fiche pratique IA",
  demain: "La médecine de demain",
  actu: "Actualité IA",
};

function formatDay(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border-2 border-ink bg-background px-5 py-4">
      <p className="text-xs uppercase tracking-widest text-[var(--ink)]/50">{label}</p>
      <p className="mt-1 truncate font-display text-2xl">{value}</p>
    </div>
  );
}

export function AdminAnalytics() {
  const { data: pageviews } = useQuery({
    queryKey: ["analytics", "pageviews-daily"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("analytics_pageviews_daily", { _days: 30 });
      if (error) throw error;
      return (data ?? []).map((d) => ({ day: d.day, views: Number(d.views) }));
    },
  });

  const { data: topPaths } = useQuery({
    queryKey: ["analytics", "top-paths"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("analytics_top_paths", { _days: 30, _limit: 8 });
      if (error) throw error;
      return (data ?? []).map((d) => ({ path: d.path, views: Number(d.views) }));
    },
  });

  const { data: subsDaily } = useQuery({
    queryKey: ["analytics", "subscribers-daily"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("analytics_subscribers_daily", { _days: 30 });
      if (error) throw error;
      return (data ?? []).map((d) => ({ day: d.day, signups: Number(d.signups) }));
    },
  });

  const { data: subsByTrack } = useQuery({
    queryKey: ["analytics", "subscribers-by-track"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("analytics_subscribers_by_track");
      if (error) throw error;
      return (data ?? []).map((d) => ({ track: d.track, subscribers: Number(d.subscribers) }));
    },
  });

  const { data: sentIssues } = useQuery({
    queryKey: ["analytics", "newsletters-sent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_issues")
        .select("recipient_count")
        .eq("status", "sent");
      if (error) throw error;
      return data ?? [];
    },
  });

  const totalViews30d = (pageviews ?? []).reduce((sum, p) => sum + p.views, 0);
  const totalSubscribers30d = (subsDaily ?? []).reduce((sum, s) => sum + s.signups, 0);
  const totalSent = sentIssues?.length ?? 0;
  const totalReached = (sentIssues ?? []).reduce((sum, n) => sum + n.recipient_count, 0);

  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl">Analytics</h2>

      <h3 className="mt-6 text-xs font-bold uppercase tracking-widest text-[var(--ink)]/50">
        Site web · 30 derniers jours
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <StatTile label="Vues de page" value={totalViews30d} />
        <StatTile label="Page la plus vue" value={(topPaths ?? [])[0]?.path || "—"} />
      </div>
      <div className="mt-4 h-56 rounded-2xl border-2 border-ink bg-card p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={pageviews ?? []}>
            <defs>
              <linearGradient id="pv-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--blue)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--blue)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.08)" />
            <XAxis
              dataKey="day"
              tickFormatter={formatDay}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} width={30} />
            <Tooltip labelFormatter={formatDay} />
            <Area
              type="monotone"
              dataKey="views"
              stroke="var(--blue)"
              fill="url(#pv-fill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {(topPaths ?? []).length > 0 && (
        <div className="mt-3 space-y-1 text-sm">
          {(topPaths ?? []).map((p) => (
            <div
              key={p.path}
              className="flex items-center justify-between rounded-lg border border-ink/10 px-3 py-1.5"
            >
              <span className="font-medium">{p.path || "/"}</span>
              <span className="text-[var(--ink)]/50">{p.views} vues</span>
            </div>
          ))}
        </div>
      )}

      <h3 className="mt-10 text-xs font-bold uppercase tracking-widest text-[var(--ink)]/50">
        Newsletter
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <StatTile label="Nouveaux abonnés (30j)" value={totalSubscribers30d} />
        <StatTile label="Newsletters envoyées" value={totalSent} />
        <StatTile label="Emails délivrés (cumulé)" value={totalReached} />
      </div>
      <div className="mt-4 h-56 rounded-2xl border-2 border-ink bg-card p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={subsDaily ?? []}>
            <defs>
              <linearGradient id="sub-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--pink)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--pink)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.08)" />
            <XAxis
              dataKey="day"
              tickFormatter={formatDay}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} width={30} />
            <Tooltip labelFormatter={formatDay} />
            <Area
              type="monotone"
              dataKey="signups"
              stroke="var(--pink)"
              fill="url(#sub-fill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {(subsByTrack ?? []).length > 0 && (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {(subsByTrack ?? []).map((t) => (
            <div
              key={t.track}
              className="rounded-xl border border-ink/15 bg-background px-4 py-3 text-sm"
            >
              <p className="text-[var(--ink)]/60">{TRACK_LABELS[t.track] ?? t.track}</p>
              <p className="font-display text-xl">{t.subscribers}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
