import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { StatusBadge, SeverityBadge } from "@/components/badges";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Activity, ArrowUpRight, ArrowDownRight, Plus, Fingerprint,
  Network, FileText, Zap, TrendingUp, AlertTriangle
} from "lucide-react";
import { investigations, stats, timeline, fmtDate } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AXIOM OSINT" },
      { name: "description", content: "Overview of active investigations, connector health, and recent intelligence events." },
    ],
  }),
  component: Dashboard,
});

const toneMap: Record<string, string> = {
  cyan: "from-primary/20 to-primary/0 text-primary",
  violet: "from-accent/20 to-accent/0 text-accent",
  warning: "from-warning/20 to-warning/0 text-warning",
  danger: "from-destructive/20 to-destructive/0 text-destructive",
};

function Dashboard() {
  const recent = investigations.slice(0, 5);

  return (
    <AppShell
      title="Command Center"
      subtitle="Real-time overview of your OSINT operations"
      actions={
        <Link to="/investigations/new">
          <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 gap-2">
            <Plus className="h-4 w-4" /> New Investigation
          </Button>
        </Link>
      }
    >
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass relative overflow-hidden p-5 border-border/60">
            <div className={cn("absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl bg-gradient-radial", toneMap[s.tone])} />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="mt-2 text-3xl font-display font-bold">{s.value}</div>
              </div>
              <div className={cn("h-9 w-9 rounded-lg grid place-items-center bg-gradient-to-br", toneMap[s.tone])}>
                {s.tone === "cyan" && <Activity className="h-4 w-4" />}
                {s.tone === "violet" && <Fingerprint className="h-4 w-4" />}
                {s.tone === "warning" && <Zap className="h-4 w-4" />}
                {s.tone === "danger" && <AlertTriangle className="h-4 w-4" />}
              </div>
            </div>
            <div className="relative mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              {s.trend === "up" && <ArrowUpRight className="h-3 w-3 text-success" />}
              {s.trend === "down" && <ArrowDownRight className="h-3 w-3 text-success" />}
              {s.trend === "warn" && <TrendingUp className="h-3 w-3 text-warning" />}
              <span>{s.delta}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        {/* Recent investigations */}
        <Card className="glass xl:col-span-2 p-5 border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold">Recent Investigations</h3>
              <p className="text-xs text-muted-foreground">Ongoing and recently updated cases</p>
            </div>
            <Link to="/investigations" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recent.map((inv) => (
              <Link
                key={inv.id}
                to="/investigations/$id"
                params={{ id: inv.id }}
                className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-border/60 hover:bg-white/[0.03] transition"
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 grid place-items-center shrink-0">
                  <span className="text-[10px] font-mono text-primary">{inv.id.split("-")[1]}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium truncate">{inv.name}</span>
                    <SeverityBadge severity={inv.severity} />
                  </div>
                  <div className="text-xs text-muted-foreground font-mono truncate">{inv.target}</div>
                </div>
                <div className="hidden md:block w-32">
                  <Progress value={inv.progress} className="h-1.5" />
                  <div className="text-[10px] text-muted-foreground mt-1">{inv.progress}% • {inv.identifiers} ids</div>
                </div>
                <StatusBadge status={inv.status} />
              </Link>
            ))}
          </div>
        </Card>

        {/* Quick actions */}
        <div className="space-y-4">
          <Card className="glass p-5 border-border/60">
            <h3 className="font-display text-lg font-semibold">Quick Actions</h3>
            <p className="text-xs text-muted-foreground">Jump into common workflows</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                { icon: Plus, label: "New case", to: "/investigations/new", tone: "primary" },
                { icon: Fingerprint, label: "Identity", to: "/identity", tone: "accent" },
                { icon: Network, label: "Graph", to: "/graph", tone: "primary" },
                { icon: FileText, label: "Reports", to: "/reports", tone: "accent" },
              ].map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="group flex flex-col items-start gap-2 p-3 rounded-xl bg-surface/60 border border-border/60 hover:border-primary/40 hover:bg-surface transition"
                >
                  <div className={cn("h-8 w-8 rounded-lg grid place-items-center",
                    a.tone === "primary" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"
                  )}>
                    <a.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium">{a.label}</span>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="glass p-5 border-border/60">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Live Feed</h3>
              <span className="text-[10px] uppercase tracking-widest text-success flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success pulse-ring" /> Live
              </span>
            </div>
            <div className="mt-3 space-y-3">
              {timeline.slice(0, 4).map((e) => (
                <div key={e.id} className="flex gap-3 text-xs">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <div className="min-w-0">
                    <div className="text-foreground">
                      <span className="font-medium text-primary">{e.actor}</span>{" "}
                      <span className="text-muted-foreground">{e.action.toLowerCase()}</span>{" "}
                      <span className="font-mono">{e.target}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">{fmtDate(e.time)}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
