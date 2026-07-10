import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Globe, User, Wallet, Share2, Phone, Server, Shield, Copy, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/identity")({
  head: () => ({ meta: [{ title: "Identity Profile — AXIOM OSINT" }] }),
  component: Identity,
});

const sections = [
  { key: "emails", icon: Mail, title: "Emails", items: [
    { value: "j.doe@protonmail.com", confidence: 98, sources: 6, note: "Primary — active" },
    { value: "shadow.doe@tuta.io", confidence: 82, sources: 3, note: "Alias" },
    { value: "jd1990@gmail.com", confidence: 61, sources: 2, note: "Historical" },
  ]},
  { key: "domains", icon: Globe, title: "Domains", items: [
    { value: "secure-login-verify.io", confidence: 91, sources: 5, note: "Typosquat" },
    { value: "doe-consulting.net", confidence: 74, sources: 3, note: "Personal" },
  ]},
  { key: "usernames", icon: User, title: "Usernames", items: [
    { value: "nullbyte_x", confidence: 76, sources: 4, note: "Twitter / GitHub" },
    { value: "j.doe_1990", confidence: 64, sources: 2, note: "Reddit" },
    { value: "jdoe", confidence: 48, sources: 1, note: "Steam" },
  ]},
  { key: "wallets", icon: Wallet, title: "Wallets", items: [
    { value: "0x9a8b3f4c2d1e5f6a7b8c9d0e1f2a3b4c5d6e7f21c", confidence: 88, sources: 7, note: "Ethereum" },
    { value: "bc1q…9v3f", confidence: 55, sources: 1, note: "Bitcoin — unverified" },
  ]},
  { key: "social", icon: Share2, title: "Social Accounts", items: [
    { value: "twitter.com/nullbyte_x", confidence: 79, sources: 3, note: "2.1k followers" },
    { value: "t.me/ring42", confidence: 84, sources: 4, note: "Channel admin" },
    { value: "github.com/nullbyte", confidence: 66, sources: 2, note: "12 repos" },
  ]},
  { key: "phones", icon: Phone, title: "Phones", items: [
    { value: "+1 415 ••• 0142", confidence: 55, sources: 1, note: "SF Bay Area" },
  ]},
  { key: "network", icon: Server, title: "Network", items: [
    { value: "185.220.101.47", confidence: 70, sources: 3, note: "Tor exit" },
    { value: "AS14061 — DigitalOcean", confidence: 62, sources: 2, note: "Recent" },
  ]},
];

function Identity() {
  return (
    <AppShell title="Unified Identity Profile" subtitle="Aggregated view of every observed identifier for the primary target">
      {/* Subject header */}
      <Card className="glass border-border/60 overflow-hidden">
        <div className="relative p-6">
          <div className="absolute inset-0 opacity-30 gradient-text" />
          <div className="relative flex flex-wrap items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-lg opacity-70 bg-gradient-to-br from-primary to-accent" />
              <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-2xl font-display font-bold text-primary-foreground">
                JD
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Subject</div>
              <div className="text-xl font-display font-semibold">John Doe (attributed)</div>
              <div className="text-xs text-muted-foreground font-mono mt-0.5">SUBJECT-a29fc41e · linked to INV-1042</div>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <MetricPill label="Total identifiers" value="47" />
              <MetricPill label="Sources" value="12" />
              <MetricPill label="Overall confidence" value="86%" tone="success" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {sections.map((sec) => (
          <Card key={sec.key} className="glass p-5 border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center">
                  <sec.icon className="h-4 w-4" />
                </div>
                <h3 className="font-display font-semibold">{sec.title}</h3>
                <span className="text-xs text-muted-foreground">({sec.items.length})</span>
              </div>
            </div>
            <div className="mt-3 divide-y divide-border/40">
              {sec.items.map((it) => (
                <div key={it.value} className="py-3 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xs truncate">{it.value}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{it.note}</div>
                  </div>
                  <div className="hidden sm:block w-28">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                        <div className={cn("h-full",
                          it.confidence >= 85 ? "bg-success" : it.confidence >= 65 ? "bg-warning" : "bg-destructive"
                        )} style={{ width: `${it.confidence}%` }} />
                      </div>
                      <span className="text-[10px] font-mono w-6 text-right">{it.confidence}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 text-right">{it.sources} src</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><ExternalLink className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Evidence */}
      <Card className="glass p-5 border-border/60 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="font-display font-semibold">Evidence Chain</h3>
        </div>
        <div className="space-y-2 text-xs">
          {[
            { src: "HaveIBeenPwned", finding: "6 breach matches for j.doe@protonmail.com", conf: 98 },
            { src: "Etherscan", finding: "Wallet 0x9a8b…f21c received 0.42 ETH from mixer", conf: 92 },
            { src: "Whoxy", finding: "Domain secure-login-verify.io registered with same phone hash", conf: 84 },
            { src: "Twitter Graph", finding: "@nullbyte_x bio contains proton email pattern", conf: 71 },
          ].map((e, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-border/40">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground w-32 shrink-0">{e.src}</span>
              <span className="flex-1 min-w-0">{e.finding}</span>
              <span className="text-[10px] font-mono text-primary">conf {e.conf}%</span>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}

function MetricPill({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className={cn("rounded-xl border px-3 py-1.5",
      tone === "success" ? "border-success/40 bg-success/10" : "border-border/60 bg-surface/60"
    )}>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={cn("text-sm font-display font-semibold", tone === "success" && "text-success")}>{value}</div>
    </div>
  );
}
