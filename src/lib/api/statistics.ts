import { useMutation, useQuery } from "@tanstack/react-query";
import { format, isValid, parseISO } from "date-fns";

import { API_BASE_URL, ApiError, apiRequest } from "./client";

export type DailyStatisticsPoint = {
  date: string;
  received: number;
  completed: number;
};

export type OrganizationStatisticsItem = {
  id?: string;
  name: string;
  count: number;
  governance?: string;
};

export type SpecialistStatisticsItem = {
  id?: string;
  name: string;
  completed: number;
  averageDuration?: string;
};

export type StatisticsExportParams = {
  startDate?: string;
  endDate?: string;
  organization?: string;
};

const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
  "#2563eb",
  "#14b8a6",
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
};

const extractArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  const candidates = [
    payload.items,
    payload.series,
    payload.data,
    payload.rows,
    payload.organizations,
    payload.specialists,
    payload.daily,
    payload.byOrganization,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
};

const formatChartDate = (value: unknown): string => {
  if (typeof value !== "string" || !value.trim()) return "—";
  const parsed = parseISO(value.length === 10 ? `${value}T00:00:00` : value);
  if (!isValid(parsed)) return value;
  return format(parsed, "dd.MM");
};

const resolvePersonName = (value: unknown): string => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (!isRecord(value)) return "—";

  const firstName =
    typeof value.firstName === "string" ? value.firstName.trim() : "";
  const lastName =
    typeof value.lastName === "string" ? value.lastName.trim() : "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  if (fullName) return fullName;

  if (typeof value.name === "string" && value.name.trim()) return value.name.trim();
  return "—";
};

const resolveOrganization = (
  row: Record<string, unknown>,
): { id?: string; name: string; governance?: string } => {
  const organization = row.organization;

  if (typeof organization === "string" && organization.trim()) {
    return {
      id: organization,
      name:
        (typeof row.organizationName === "string" && row.organizationName) ||
        (typeof row.name === "string" && row.name) ||
        organization,
      governance:
        typeof row.governance === "string" ? row.governance : undefined,
    };
  }

  if (isRecord(organization)) {
    return {
      id:
        typeof organization._id === "string"
          ? organization._id
          : typeof organization.id === "string"
            ? organization.id
            : undefined,
      name:
        (typeof organization.name === "string" && organization.name) ||
        (typeof row.organizationName === "string" && row.organizationName) ||
        "—",
      governance:
        (typeof organization.governance === "string" &&
          organization.governance) ||
        (typeof row.governance === "string" ? row.governance : undefined),
    };
  }

  return {
    id:
      typeof row.organizationId === "string"
        ? row.organizationId
        : typeof row._id === "string"
          ? row._id
          : undefined,
    name:
      (typeof row.organizationName === "string" && row.organizationName) ||
      (typeof row.name === "string" && row.name) ||
      "—",
    governance:
      typeof row.governance === "string" ? row.governance : undefined,
  };
};

export const normalizeDailyStatistics = (
  payload: unknown,
): DailyStatisticsPoint[] => {
  return extractArray(payload)
    .map((entry) => {
      if (!isRecord(entry)) return null;

      const date =
        entry.date ?? entry.day ?? entry.label ?? entry.period ?? entry._id;
      const received = toNumber(
        entry.received ?? entry.created ?? entry.total ?? entry.count,
      );
      const completed = toNumber(
        entry.completed ?? entry.done ?? entry.finished ?? entry.resolved,
      );

      return {
        date: formatChartDate(date),
        received,
        completed,
      };
    })
    .filter((row): row is DailyStatisticsPoint => row !== null);
};

export const normalizeOrganizationStatistics = (
  payload: unknown,
): OrganizationStatisticsItem[] => {
  return extractArray(payload)
    .map((entry) => {
      if (!isRecord(entry)) return null;

      const organization = resolveOrganization(entry);
      const count = toNumber(
        entry.count ?? entry.total ?? entry.value ?? entry.requests,
      );

      return {
        id: organization.id,
        name: organization.name,
        count,
        governance: organization.governance,
      };
    })
    .filter((row): row is OrganizationStatisticsItem => row !== null);
};

export const normalizeSpecialistStatistics = (
  payload: unknown,
): SpecialistStatisticsItem[] => {
  return extractArray(payload)
    .map((entry) => {
      if (!isRecord(entry)) return null;

      const specialist = entry.specialist ?? entry.user ?? entry.staff;
      const name =
        (typeof entry.specialistName === "string" && entry.specialistName) ||
        resolvePersonName(specialist);
      const completed = toNumber(
        entry.completed ??
          entry.completedCount ??
          entry.done ??
          entry.total ??
          entry.count,
      );
      const durationRaw =
        entry.averageDuration ??
        entry.avgDuration ??
        entry.averageTime ??
        entry.duration;

      return {
        id: isRecord(specialist)
          ? typeof specialist._id === "string"
            ? specialist._id
            : typeof specialist.id === "string"
              ? specialist.id
              : undefined
          : typeof entry.specialistId === "string"
            ? entry.specialistId
            : undefined,
        name,
        completed,
        averageDuration:
          typeof durationRaw === "string" || typeof durationRaw === "number"
            ? String(durationRaw)
            : undefined,
      };
    })
    .filter((row): row is SpecialistStatisticsItem => row !== null);
};

export const mapStatisticsToChartSeries = <
  T extends { name: string; count: number },
>(
  items: T[],
): Array<T & { value: number; color: string }> =>
  items.map((item, index) => ({
    ...item,
    value: item.count,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

export const groupOrganizationStatisticsByGovernance = (
  items: OrganizationStatisticsItem[],
): Array<{ name: string; value: number; color: string }> => {
  const totals = new Map<string, number>();

  for (const item of items) {
    const key = item.governance?.trim() || "Boshqa";
    totals.set(key, (totals.get(key) ?? 0) + item.count);
  }

  return Array.from(totals.entries()).map(([name, value], index) => ({
    name,
    value,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));
};

export const buildStatisticsExportQuery = (params: StatisticsExportParams) => {
  const searchParams = new URLSearchParams();
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);
  if (params.organization) searchParams.set("organization", params.organization);
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const parseFilename = (contentDisposition: string | null): string | undefined => {
  if (!contentDisposition) return undefined;
  const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(
    contentDisposition,
  );
  const raw = match?.[1] ?? match?.[2];
  if (!raw) return undefined;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

export const downloadStatisticsExport = async (
  params: StatisticsExportParams,
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/api/statistics/export${buildStatisticsExportQuery(params)}`,
    {
      credentials: "include",
      headers: { Accept: "*/*" },
    },
  );

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const payload = await response.json();
      const message =
        typeof payload === "object" && payload && "message" in payload
          ? String(payload.message)
          : response.statusText;
      throw new ApiError(message, response.status, payload);
    }
    throw new ApiError(response.statusText, response.status);
  }

  const blob = await response.blob();
  const filename =
    parseFilename(response.headers.get("content-disposition")) ??
    `murojaatlar-${params.startDate ?? "export"}.xlsx`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const useDailyStatistics = (days = 30) => {
  const safeDays = Math.min(365, Math.max(1, days));

  return useQuery({
    queryKey: ["statistics", "daily", safeDays],
    queryFn: async () => {
      const response = await apiRequest<unknown>(
        `/api/statistics/daily?days=${safeDays}`,
      );
      return normalizeDailyStatistics(response.data);
    },
    staleTime: 60_000,
    retry: false,
  });
};

export const useOrganizationStatistics = () => {
  return useQuery({
    queryKey: ["statistics", "by-organization"],
    queryFn: async () => {
      const response = await apiRequest<unknown>(
        "/api/statistics/by-organization",
      );
      return normalizeOrganizationStatistics(response.data);
    },
    staleTime: 60_000,
    retry: false,
  });
};

export const useSpecialistStatistics = () => {
  return useQuery({
    queryKey: ["statistics", "specialists"],
    queryFn: async () => {
      const response = await apiRequest<unknown>("/api/statistics/specialists");
      return normalizeSpecialistStatistics(response.data);
    },
    staleTime: 60_000,
    retry: false,
  });
};

export const useExportStatistics = () => {
  return useMutation({
    mutationFn: downloadStatisticsExport,
  });
};
