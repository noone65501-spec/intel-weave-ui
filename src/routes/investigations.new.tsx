import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Rocket } from "lucide-react";

export const Route = createFileRoute("/investigations/new")({
  head: () => ({ meta: [{ title: "New Investigation — AXIOM OSINT" }] }),
  component: New,
});

function New() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  return (
    <AppShell
      title="Create Investigation"
      subtitle="Seed a new case with one or more identifiers"
      actions={
        <Link to="/investigations">
          <Button variant="ghost" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
        </Link>
      }
    >
      <div className="max-w-3xl mx-auto">
        <Card className="glass p-6 border-border/60 space-y-5">
          <div>
            <Label>Case name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Operation Nightshade" className="mt-1.5 bg-surface/60" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Severity</Label>
              <Select defaultValue="high">
                <SelectTrigger className="mt-1.5 bg-surface/60"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Seed identifier type</Label>
              <Select defaultValue="email">
                <SelectTrigger className="mt-1.5 bg-surface/60"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="domain">Domain</SelectItem>
                  <SelectItem value="username">Username</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="ip">IP Address</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Seed identifiers</Label>
            <Textarea rows={4} placeholder="one per line, e.g.&#10;j.doe@protonmail.com&#10;secure-login-verify.io" className="mt-1.5 bg-surface/60 font-mono text-xs" />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea rows={3} placeholder="Investigator context, mandates, TLP…" className="mt-1.5 bg-surface/60" />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
            <Button variant="ghost" onClick={() => nav({ to: "/investigations" })}>Cancel</Button>
            <Button onClick={() => nav({ to: "/investigations/$id", params: { id: "INV-1042" } })} className="bg-gradient-to-r from-primary to-accent text-primary-foreground gap-2">
              <Rocket className="h-4 w-4" /> Launch Investigation
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
