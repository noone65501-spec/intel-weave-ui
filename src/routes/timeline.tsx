import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { SeverityBadge } from "@/components/badges";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Globe, Share2, Wallet, Server, Settings2, Search } from "lucide-react";
import { timeline, fmtDate } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timeline")({
  head: () => ({ meta: [{ title: "Timeline — AXIOM OSINT" }] }),
  component: Timeline,
});

const channelIcon = { email: Mail, domain: Globe, social: Share2, wallet: Wallet, network: Server, system: Settings2 };
const channelColor: Record<string, string> = {
  email: "text-primary bg-primary/15",
  domain: "text-accent bg-accent/15",
  social: "text-warning bg-warning/15",
  wallet: "text-success bg-success/15",
  network: "text-destructive bg-destructive/15",
  system: "text-muted-foreground bg-white/5",
};

function Timeline() {
  const [q, setQ] = useState("");
  const [ch, setCh] = useState("all");
  const events = useMemo(() =>
    timeline.filter((e) =>
      (ch === "all" || e.channel === ch) &&
      (q === "" || (e.actor + e.target + e.details).toLowerCase().includes(q.toLowerCase()))
    ), [q, ch]);

  return (
    <AppShell title="Timeline" subtitle="Chronological event log across all connectors">
      <Card className="glass p-4 border-border/60">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events…" className="pl-9 bg-surface/60" />
          </div>
          <Select value={ch} onValueChange={setCh}>
            <SelectTrigger className="w-[180px] bg-surface/60"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All channels</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="domain">Domain</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="wallet">Wallet</SelectItem>
              <SelectItem value="network">Network</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="mt-6 relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-border to-transparent" />
        <div className="space-y-3">
          {events.map((e) => {
            const Icon = channelIcon[e.channel];
            return (
              <div key={e.id} className="relative pl-14">
                <div className={cn("absolute left-6 -translate-x-1/2 top-4 h-4 w-4 rounded-full grid place-items-center", channelColor[e.channel])}>
                  <Icon className="h-2.5 w-2.5" />
                </div>
                <Card className="glass p-4 border-border/60">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-medium text-foreground">{e.actor}</span>
                    <span className="text-muted-foreground">{e.action}</span>
                    <span className="font-mono">{e.target}</span>
                    <SeverityBadge severity={e.severity} />
                    <span className="ml-auto text-muted-foreground">{fmtDate(e.time)}</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{e.details}</div>
                </Card>
              </div>
            );
          })}
          {events.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">No events match your filters.</div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
