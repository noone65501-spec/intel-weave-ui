// Thin data-fetching hooks that isolate pages from the provider.
//
// The current provider resolves synchronously from local fixtures, so hooks
// hydrate immediately and preserve the existing zero-flash UX. Swap in an
// HTTP-backed `DataProvider` and these same hooks will begin exposing
// meaningful `isLoading` / `error` states without any page change — pages
// already render `<LoadingState/>`, `<EmptyState/>`, `<ErrorState/>`.

import { useCallback, useEffect, useState } from "react";
import { getDataProvider } from "@/lib/api/data-provider";
import type {
  ApiError,
  AsyncResource,
  Connector,
  DashboardStat,
  ExecutionResult,
  GeneratedReport,
  GraphData,
  Identifier,
  IdentityProfile,
  Investigation,
  MutationResource,
  NewInvestigationInput,
  Report,
  ReportDownload,
  TimelineEvent,
} from "@/types/domain";
import type {
  ApiError,
  AsyncResource,
  Connector,
  DashboardStat,
  GraphData,
  Identifier,
  IdentityProfile,
  Investigation,
  Report,
  TimelineEvent,
} from "@/types/domain";

function useResource<T>(
  loader: () => Promise<T>,
  deps: ReadonlyArray<unknown>,
): AsyncResource<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const run = useCallback(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    loader()
      .then((value) => {
        if (cancelled) return;
        setData(value);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError({
          message: err instanceof Error ? err.message : "Unknown error",
        });
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);

  return { data, isLoading, error, refetch: run };
}

export function useInvestigations(): AsyncResource<Investigation[]> {
  return useResource(() => getDataProvider().listInvestigations(), []);
}

export function useInvestigation(id: string): AsyncResource<Investigation | undefined> {
  return useResource(() => getDataProvider().getInvestigation(id), [id]);
}

export function useIdentifiers(
  investigationId?: string,
): AsyncResource<Identifier[]> {
  return useResource(
    () => getDataProvider().listIdentifiers(investigationId),
    [investigationId],
  );
}

export function useConnectors(
  investigationId?: string,
): AsyncResource<Connector[]> {
  return useResource(
    () => getDataProvider().listConnectors(investigationId),
    [investigationId],
  );
}

export function useTimeline(
  investigationId?: string,
): AsyncResource<TimelineEvent[]> {
  return useResource(
    () => getDataProvider().listTimeline(investigationId),
    [investigationId],
  );
}

export function useReports(): AsyncResource<Report[]> {
  return useResource(() => getDataProvider().listReports(), []);
}

export function useDashboardStats(): AsyncResource<DashboardStat[]> {
  return useResource(() => getDataProvider().getDashboardStats(), []);
}

export function useIdentityProfile(
  subjectId?: string,
): AsyncResource<IdentityProfile> {
  return useResource(
    () => getDataProvider().getIdentityProfile(subjectId),
    [subjectId],
  );
}

export function useGraph(investigationId?: string): AsyncResource<GraphData> {
  return useResource(
    () => getDataProvider().getGraph(investigationId),
    [investigationId],
  );
}
