// Backwards-compatible re-exports. All new code should import from
// `@/types/domain`, `@/hooks/use-osint-data`, or `@/lib/format`.
// This file exists so any lingering callers keep working during the
// architectural refactor and can be removed in a later pass.
export type {
  Investigation,
  InvestigationStatus,
  Severity,
  Identifier,
  Connector,
  TimelineEvent,
  Report,
} from "@/types/domain";
export { fmtDate } from "@/lib/format";
