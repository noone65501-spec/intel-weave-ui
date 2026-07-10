import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge, SeverityBadge } from "@/components/badges";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { investigations, fmtDate } from "@/lib/mock-data";

export const Route = createFileRoute("/investigations/")({
  head: () => ({ meta: [{ title: "Investigations — AXIOM OSINT" }] }),
  component: List,
});

function List() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<"recent" | "name" | "severity">("recent");

  const filtered = useMemo(() => {
    let list = investigations.filter((i) =>
      (status === "all" || i.status === status) &&
      (query === "" ||
        i.name.toLowerCase().includes(query.toLowerCase()) ||
        i.target.toLowerCase().includes(query.toLowerCase()) ||
        i.id.toLowerCase().includes(query.toLowerCase()))
    );
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "severity") {
      const w = { critical: 0, high: 1, medium: 2, low: 3 } as const;
      list = [...list].sort((a, b) => w[a.severity] - w[b.severity]);
    }
    if (sort === "recent") list = [...list].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
    return list;
  }, [query, status, sort]);

  return (
    <AppShell
      title="Investigations"
      subtitle={`${filtered.length} of ${investigations.length} cases`}
      actions={
        <Link to="/investigations/new">
          <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2">
            <Plus className="h-4 w-4" /> New Investigation
          </Button>
        </Link>
      }
    >
      <Card className="glass p-4 border-border/60">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by name, target, ID…" className="pl-9 bg-surface/60" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px] bg-surface/60"><Filter className="h-3.5 w-3.5 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="w-[180px] bg-surface/60"><ArrowUpDown className="h-3.5 w-3.5 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently updated</SelectItem>
              <SelectItem value="name">Name A–Z</SelectItem>
              <SelectItem value="severity">Severity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="glass mt-4 border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="px-5 py-3 font-medium">Case</th>
                <th className="px-5 py-3 font-medium">Target</th>
                <th className="px-5 py-3 font-medium">Severity</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Progress</th>
                <th className="px-5 py-3 font-medium">Owner</th>
                <th className="px-5 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b border-border/40 hover:bg-white/[0.02] transition">
                  <td className="px-5 py-3">
                    <Link to="/investigations/$id" params={{ id: inv.id }} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary/20 to-accent/20 grid place-items-center text-[10px] font-mono text-primary">
                        {inv.id.split("-")[1]}
                      </div>
                      <div>
                        <div className="font-medium hover:text-primary">{inv.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{inv.id}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{inv.target}</td>
                  <td className="px-5 py-3"><SeverityBadge severity={inv.severity} /></td>
                  <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-5 py-3 w-48">
                    <Progress value={inv.progress} className="h-1.5" />
                    <div className="text-[10px] text-muted-foreground mt-1">{inv.progress}% • {inv.identifiers} identifiers</div>
                  </td>
                  <td className="px-5 py-3 text-xs">{inv.owner}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{fmtDate(inv.updatedAt)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-16 text-center text-muted-foreground">
                  <div className="text-sm">No investigations match your filters.</div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border/60 text-xs text-muted-foreground">
          <div>Showing 1–{filtered.length} of {investigations.length}</div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" disabled><ChevronLeft className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="sm" className="text-primary">1</Button>
            <Button variant="ghost" size="sm">2</Button>
            <Button variant="ghost" size="sm">3</Button>
            <Button variant="ghost" size="sm"><ChevronRight className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
