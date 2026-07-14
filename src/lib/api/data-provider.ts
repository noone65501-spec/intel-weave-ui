// Data-provider abstraction.
//
// Pages and components consume data via this contract; they never import the
// mock fixtures directly. To wire the frontend to the real FastAPI backend,
// implement `DataProvider` with `fetch`-based calls and register it via
// `setDataProvider(...)` (e.g. inside `src/router.tsx` or a bootstrap file).

import type {
  Connector,
  DashboardStat,
  GraphData,
  Identifier,
  IdentityProfile,
  Investigation,
  Report,
  TimelineEvent,
} from "@/types/domain";
import {
  connectorsFixture,
  graphFixture,
  identifiersFixture,
  identityProfileFixture,
  investigationsFixture,
  reportsFixture,
  statsFixture,
  timelineFixture,
} from "./mock-fixtures";

export interface DataProvider {
  listInvestigations(): Promise<Investigation[]>;
  getInvestigation(id: string): Promise<Investigation | undefined>;
  listIdentifiers(investigationId?: string): Promise<Identifier[]>;
  listConnectors(investigationId?: string): Promise<Connector[]>;
  listTimeline(investigationId?: string): Promise<TimelineEvent[]>;
  listReports(): Promise<Report[]>;
  getDashboardStats(): Promise<DashboardStat[]>;
  getIdentityProfile(subjectId?: string): Promise<IdentityProfile>;
  getGraph(investigationId?: string): Promise<GraphData>;
}

// Default implementation reads from bundled fixtures. Async signature keeps
// the contract identical when a real HTTP-backed provider replaces it.
export const mockDataProvider: DataProvider = {
  async listInvestigations() {
    return investigationsFixture;
  },
  async getInvestigation(id) {
    return investigationsFixture.find((i) => i.id === id);
  },
  async listIdentifiers() {
    return identifiersFixture;
  },
  async listConnectors() {
    return connectorsFixture;
  },
  async listTimeline() {
    return timelineFixture;
  },
  async listReports() {
    return reportsFixture;
  },
  async getDashboardStats() {
    return statsFixture;
  },
  async getIdentityProfile() {
    return identityProfileFixture;
  },
  async getGraph() {
    return graphFixture;
  },
};

let activeProvider: DataProvider = mockDataProvider;

export function setDataProvider(provider: DataProvider): void {
  activeProvider = provider;
}

export function getDataProvider(): DataProvider {
  return activeProvider;
}
