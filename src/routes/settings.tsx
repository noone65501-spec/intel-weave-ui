import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/badges";
import { Key, Palette, User, Bell, Save, Eye, EyeOff, Plus } from "lucide-react";
import { useState } from "react";
import { connectors } from "@/lib/mock-data";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — AXIOM OSINT" }] }),
  component: Settings,
});

function Settings() {
  const [show, setShow] = useState(false);

  return (
    <AppShell title="Settings" subtitle="Manage keys, connectors, profile, and appearance">
      <Tabs defaultValue="keys">
        <TabsList className="bg-surface/60 border border-border/60">
          <TabsTrigger value="keys"><Key className="h-3.5 w-3.5 mr-1.5" /> API Keys</TabsTrigger>
          <TabsTrigger value="connectors">Connectors</TabsTrigger>
          <TabsTrigger value="profile"><User className="h-3.5 w-3.5 mr-1.5" /> Profile</TabsTrigger>
          <TabsTrigger value="theme"><Palette className="h-3.5 w-3.5 mr-1.5" /> Theme</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="h-3.5 w-3.5 mr-1.5" /> Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          <Card className="glass p-6 border-border/60">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">API Keys</h3>
                <p className="text-sm text-muted-foreground">Personal access tokens for the AXIOM REST API.</p>
              </div>
              <Button className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"><Plus className="h-4 w-4" /> New key</Button>
            </div>
            <div className="mt-5 space-y-3">
              {[
                { name: "Production", key: "axm_live_9f2a3b4c5d6e7f8a9b0c1d2e", created: "2026-04-11", used: "2 min ago" },
                { name: "CI Pipeline", key: "axm_live_1a2b3c4d5e6f7g8h9i0j1k2l", created: "2026-05-02", used: "3 hours ago" },
              ].map((k) => (
                <div key={k.key} className="flex items-center gap-3 p-4 rounded-xl bg-surface/60 border border-border/60">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm">{k.name}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="font-mono text-xs text-muted-foreground">
                        {show ? k.key : k.key.slice(0, 12) + "•".repeat(16)}
                      </code>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShow((s) => !s)}>
                        {show ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <div>Created {k.created}</div>
                    <div>Last used {k.used}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="connectors">
          <Card className="glass p-6 border-border/60">
            <h3 className="font-display text-lg font-semibold">Connectors</h3>
            <p className="text-sm text-muted-foreground">Enable, configure, and rate-limit third-party intelligence sources.</p>
            <div className="mt-4 divide-y divide-border/60">
              {connectors.slice(0, 8).map((c) => (
                <div key={c.id} className="py-3 flex items-center gap-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center font-display font-bold text-xs">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.category}</div>
                  </div>
                  <StatusBadge status={c.status} />
                  <Switch defaultChecked={c.status !== "failed"} />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card className="glass p-6 border-border/60 max-w-2xl">
            <h3 className="font-display text-lg font-semibold">Profile</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full name" value="Mei Chen" />
              <Field label="Role" value="Senior Analyst" />
              <Field label="Email" value="m.chen@axiom-intel.io" />
              <Field label="Clearance" value="TLP:AMBER" />
            </div>
            <div className="mt-6 flex justify-end">
              <Button className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"><Save className="h-4 w-4" /> Save</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card className="glass p-6 border-border/60 max-w-2xl">
            <h3 className="font-display text-lg font-semibold">Appearance</h3>
            <p className="text-sm text-muted-foreground">Cinematic obsidian by default. Accent color drives glow and highlights.</p>
            <div className="mt-5 grid grid-cols-4 gap-3">
              {[
                ["Cyan · Violet", "from-primary to-accent", true],
                ["Ember", "from-orange-400 to-red-500", false],
                ["Emerald", "from-emerald-400 to-teal-500", false],
                ["Rose", "from-pink-400 to-fuchsia-500", false],
              ].map(([name, grad, active]) => (
                <button key={name as string} className={`rounded-xl p-3 border ${active ? "border-primary ring-2 ring-primary/40" : "border-border/60"} bg-surface/60`}>
                  <div className={`h-16 rounded-lg bg-gradient-to-br ${grad}`} />
                  <div className="mt-2 text-xs">{name}</div>
                </button>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass p-6 border-border/60 max-w-2xl">
            <h3 className="font-display text-lg font-semibold">Notifications</h3>
            <div className="mt-4 space-y-3">
              {[
                ["Critical alerts", "Instant desktop + email"],
                ["Connector failures", "Email digest"],
                ["Investigation updates", "In-app only"],
                ["Weekly intel digest", "Every Monday 09:00"],
              ].map(([label, sub]) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-surface/60 border border-border/60">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground">{sub}</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input defaultValue={value} className="mt-1.5 bg-surface/60" />
    </div>
  );
}
