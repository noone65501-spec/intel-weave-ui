import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { StatusBadge, SeverityBadge } from "@/components/badges";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Mail, Globe, User, Wallet, Share2, Phone, Server,
  Network, Clock, FileText, ArrowLeft, Play, Pause, RefreshCw
} from "lucide-react";
import { investigations, identifiers, connectors, fmtDate } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/investigations/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id} — AXIOM OSINT` }] }),
  component: Detail,
});

const typeIcon = { email: Mail, domain: Globe, username: User, wallet: Wallet, social: Share2, phone: Phone, ip: Server };

function Detail() {
  const { id } = Route.useParams();
  const inv = investigations.find((i) => i.id === id) ?? investigations[0];

  return (
    <AppShell
      title={inv.name}
      subtitle={<><span className="font-mono text-xs">{inv.id}</span> · target <span className="font-mono">{inv.target}</span></>}
      actions={
        <div className="flex items-center gap-2">
          <Link to="/investigations">
            <Button variant="ghost" className="gap-2"><ArrowLeft className="h-4 w-4" /> All cases</Button>
          </Link>
          <Button variant="secondary" className="gap-2"><RefreshCw className="h-4 w-4" /> Refresh</Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <Play className="h-4 w-4" /> Run all connectors
          </Button>
        </div>
      }
    >
      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="glass p-5 border-border/60 lg:col-span-3">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={inv.status} />
            <SeverityBadge severity={inv.severity} />
            {inv.tags.map((t) => (
              <span key={t} className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground border border-border/60">
                #{t}
              </span>
            ))}
            <div className="ml-auto text-xs text-muted-foreground">
              Owner <span className="text-foreground">{inv.owner}</span> · Updated {fmtDate(inv.updatedAt)}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Progress", value: `${inv.progress}%` },
              { label: "Identifiers", value: inv.identifiers },
              { label: "Connectors", value: inv.connectors },
              { label: "Created", value: fmtDate(inv.createdAt) },
            ].map((m) => (
              <div key={m.label}>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.label}</div>
                <div className="text-lg font-display font-semibold mt-0.5">{m.value}</div>
              </div>
            ))}
          </div>
          <Progress value={inv.progress} className="h-1.5 mt-4" />
        </Card>

        <Card className="glass p-5 border-border/60">
          <h3 className="font-display font-semibold">Jump to</h3>
          <div className="mt-3 space-y-2">
            {[
              { icon: Network, label: "Graph View", to: "/graph" },
              { icon: User, label: "Identity Profile", to: "/identity" },
              { icon: Clock, label: "Timeline", to: "/timeline" },
              { icon: FileText, label: "Reports", to: "/reports" },
            ].map((l) => (
              <Link key={l.label} to={l.to} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-sm">
                <l.icon className="h-4 w-4 text-primary" />{l.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="identifiers" className="mt-6">
        <TabsList className="bg-surface/60 border border-border/60">
          <TabsTrigger value="identifiers">Identifiers ({identifiers.length})</TabsTrigger>
          <TabsTrigger value="connectors">Connectors ({connectors.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="identifiers">
          <Card className="glass border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Value</th>
                  <th className="px-5 py-3 font-medium">Confidence</th>
                  <th className="px-5 py-3 font-medium">Sources</th>
                  <th className="px-5 py-3 font-medium">First seen</th>
                </tr>
              </thead>
              <tbody>
                {identifiers.map((i) => {
                  const Icon = typeIcon[i.type];
                  return (
                    <tr key={i.id} className="border-b border-border/40 hover:bg-white/[0.02]">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-md bg-accent/10 text-accent grid place-items-center">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-xs capitalize text-muted-foreground">{i.type}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs">{i.value}</td>
                      <td className="px-5 py-3 w-56">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                            <div className={cn("h-full",
                              i.confidence >= 85 ? "bg-success" : i.confidence >= 65 ? "bg-warning" : "bg-destructive"
                            )} style={{ width: `${i.confidence}%` }} />
                          </div>
                          <span className="text-xs font-mono w-8">{i.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs">{i.sources}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{i.firstSeen}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="connectors">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {connectors.map((c) => (
              <Card key={c.id} className="glass p-4 border-border/60">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{c.category}</div>
                    <div className="font-medium mt-0.5">{c.name}</div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Hits: <span className="text-foreground font-mono">{c.hits}</span></span>
                  <span>Runtime: <span className="text-foreground font-mono">{c.runtime}</span></span>
                </div>
                {c.status === "running" && (
                  <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-primary to-accent animate-pulse" />
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="ghost" className="h-7 gap-1"><Play className="h-3 w-3" /> Rerun</Button>
                  <Button size="sm" variant="ghost" className="h-7 gap-1"><Pause className="h-3 w-3" /> Pause</Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="glass p-6 border-border/60 text-sm text-muted-foreground">
            See the full chronological event log in the <Link to="/timeline" className="text-primary hover:underline">Timeline</Link> view.
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
