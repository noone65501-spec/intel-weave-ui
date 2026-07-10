import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail, Globe, User, Wallet, Server, ZoomIn, ZoomOut, Maximize2,
  Filter, Search, Layers, Play
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/graph")({
  head: () => ({ meta: [{ title: "Graph View — AXIOM OSINT" }] }),
  component: Graph,
});

interface Node { id: string; label: string; type: "email"|"domain"|"user"|"wallet"|"ip"; x: number; y: number; size?: number; primary?: boolean; }
interface Edge { from: string; to: string; kind: string; }

const nodes: Node[] = [
  { id: "n1", label: "j.doe@protonmail.com", type: "email", x: 50, y: 45, primary: true, size: 34 },
  { id: "n2", label: "nullbyte_x", type: "user", x: 25, y: 25 },
  { id: "n3", label: "secure-login-verify.io", type: "domain", x: 75, y: 30 },
  { id: "n4", label: "0x9a8b…f21c", type: "wallet", x: 78, y: 65 },
  { id: "n5", label: "185.220.101.47", type: "ip", x: 25, y: 68 },
  { id: "n6", label: "shadow.doe@tuta.io", type: "email", x: 15, y: 48 },
  { id: "n7", label: "t.me/ring42", type: "user", x: 88, y: 48 },
  { id: "n8", label: "j.doe_1990", type: "user", x: 35, y: 82 },
  { id: "n9", label: "acme.com", type: "domain", x: 62, y: 15 },
];

const edges: Edge[] = [
  { from: "n1", to: "n2", kind: "handle" },
  { from: "n1", to: "n3", kind: "domain-match" },
  { from: "n1", to: "n4", kind: "wallet-link" },
  { from: "n1", to: "n5", kind: "session-ip" },
  { from: "n1", to: "n6", kind: "alias" },
  { from: "n3", to: "n9", kind: "typosquat" },
  { from: "n4", to: "n7", kind: "mention" },
  { from: "n2", to: "n8", kind: "aka" },
  { from: "n5", to: "n8", kind: "session-ip" },
];

const iconMap = { email: Mail, domain: Globe, user: User, wallet: Wallet, ip: Server };
const colorMap: Record<Node["type"], string> = {
  email: "text-primary bg-primary/15 border-primary/40",
  domain: "text-accent bg-accent/15 border-accent/40",
  user: "text-warning bg-warning/15 border-warning/40",
  wallet: "text-success bg-success/15 border-success/40",
  ip: "text-destructive bg-destructive/15 border-destructive/40",
};

function Graph() {
  const [selected, setSelected] = useState<Node | null>(nodes[0]);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [zoom, setZoom] = useState(1);

  return (
    <AppShell title="Graph View" subtitle="Interactive identity graph — click nodes and edges to inspect">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        {/* Graph area */}
        <Card className="glass border-border/60 overflow-hidden">
          <div className="flex items-center gap-2 p-3 border-b border-border/60">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Find in graph…" className="h-8 pl-8 bg-surface/60 text-xs" />
            </div>
            <Button variant="ghost" size="sm" className="gap-1 h-8"><Filter className="h-3.5 w-3.5" /> Filter</Button>
            <Button variant="ghost" size="sm" className="gap-1 h-8"><Layers className="h-3.5 w-3.5" /> Layout</Button>
            <div className="ml-auto flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}><ZoomOut className="h-3.5 w-3.5" /></Button>
              <span className="text-xs font-mono w-10 text-center text-muted-foreground">{Math.round(zoom * 100)}%</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom((z) => Math.min(2, z + 0.1))}><ZoomIn className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Maximize2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>

          <div className="relative grid-bg h-[620px] overflow-hidden">
            <div className="absolute inset-0 origin-center transition-transform" style={{ transform: `scale(${zoom})` }}>
              {/* Edges */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none">
                <defs>
                  <linearGradient id="edge-grad" x1="0" x2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.17 195)" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="oklch(0.65 0.24 295)" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                {edges.map((e, i) => {
                  const a = nodes.find((n) => n.id === e.from)!;
                  const b = nodes.find((n) => n.id === e.to)!;
                  const active = selectedEdge === e;
                  return (
                    <line
                      key={i}
                      x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`}
                      stroke={active ? "oklch(0.82 0.17 195)" : "url(#edge-grad)"}
                      strokeWidth={active ? 2 : 1}
                      strokeDasharray={active ? "0" : "4 4"}
                      className="pointer-events-auto cursor-pointer"
                      onClick={() => { setSelectedEdge(e); setSelected(null); }}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {nodes.map((n) => {
                const Icon = iconMap[n.type];
                const size = n.size ?? 26;
                const isSel = selected?.id === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => { setSelected(n); setSelectedEdge(null); }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  >
                    {n.primary && <div className="absolute inset-0 -m-3 rounded-full bg-primary/30 blur-xl" />}
                    <div className={cn(
                      "relative rounded-full border grid place-items-center transition-all",
                      colorMap[n.type],
                      isSel && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                      n.primary && "shadow-[0_0_30px_-4px_var(--primary)]"
                    )} style={{ height: size, width: size }}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="mt-1 text-[10px] font-mono text-muted-foreground whitespace-nowrap text-center opacity-80 group-hover:opacity-100">
                      {n.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="absolute bottom-3 left-3 glass rounded-xl p-3 text-xs">
              <div className="font-medium mb-2">Legend</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {(Object.keys(iconMap) as Node["type"][]).map((t) => {
                  const Icon = iconMap[t];
                  return (
                    <div key={t} className="flex items-center gap-1.5 text-muted-foreground">
                      <span className={cn("h-4 w-4 rounded-full grid place-items-center border", colorMap[t])}>
                        <Icon className="h-2.5 w-2.5" />
                      </span>
                      <span className="capitalize">{t}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Side panel */}
        <div className="space-y-4">
          <Card className="glass p-5 border-border/60">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold">
                {selectedEdge ? "Edge Details" : "Node Details"}
              </h3>
              {selected?.primary && <span className="text-[10px] uppercase tracking-widest text-primary">Seed</span>}
            </div>

            {selected && !selectedEdge && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={cn("h-12 w-12 rounded-full border grid place-items-center", colorMap[selected.type])}>
                    {(() => { const Icon = iconMap[selected.type]; return <Icon className="h-5 w-5" />; })()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{selected.type}</div>
                    <div className="font-mono text-sm truncate">{selected.label}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <Field label="Confidence" value="92%" />
                  <Field label="Sources" value="6" />
                  <Field label="First seen" value="2024-11-02" />
                  <Field label="Last seen" value="2 hrs ago" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Connected</div>
                  <div className="space-y-1">
                    {edges.filter((e) => e.from === selected.id || e.to === selected.id).map((e, i) => (
                      <div key={i} className="text-xs flex items-center gap-2 p-2 rounded-md bg-white/[0.03]">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{e.kind}</span>
                        <span className="ml-auto font-mono text-[10px]">
                          {nodes.find((n) => n.id === (e.from === selected.id ? e.to : e.from))?.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"><Play className="h-3.5 w-3.5" /> Expand from node</Button>
              </div>
            )}

            {selectedEdge && (
              <div className="mt-4 space-y-3 text-sm">
                <Field label="Relation" value={selectedEdge.kind} />
                <Field label="From" value={nodes.find((n) => n.id === selectedEdge.from)?.label ?? ""} mono />
                <Field label="To" value={nodes.find((n) => n.id === selectedEdge.to)?.label ?? ""} mono />
                <Field label="Weight" value="0.82" />
                <Field label="Discovered by" value="Whoxy + Telegram Scraper" />
              </div>
            )}
          </Card>

          <Card className="glass p-5 border-border/60">
            <h3 className="font-display font-semibold">Graph Metrics</h3>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              {[["Nodes", nodes.length], ["Edges", edges.length], ["Clusters", 3]].map(([l, v]) => (
                <div key={l as string}>
                  <div className="text-xl font-display font-bold text-primary">{v}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5", mono && "font-mono text-xs break-all")}>{value}</div>
    </div>
  );
}
