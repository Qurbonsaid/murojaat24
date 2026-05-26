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

export type SpecialistStatisticsPeriod = "today" | "week" | "month";

export type SpecialistWeeklyActivityPoint = {
  label: string;
  value: number;
};

export type SpecialistRecentRating = {
  comment: string;
  rating: number;
  date: string;
};

export type SpecialistAchievementBadge = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

export type SpecialistDetailStatistics = {
  completed: number;
  averageRating: number;
  averageDurationHours: number;
  successRate: number;
  weeklyActivity: SpecialistWeeklyActivityPoint[];
  recentRatings: SpecialistRecentRating[];
  badges: SpecialistAchievementBadge[];
};

export type StatisticsExportParams = {
  startDate?: string;
  endDate?: string;
  organization?: string;
};

export type DashboardRequestStatistics = {
  total?: number;
  new?: number;
  inProgress?: number;
  completed?: number;
  verified?: number;
  rejected?: number;
  today?: number;
  thisMonth?: number;
};

export type DashboardStatistics = {
  requests?: DashboardRequestStatistics;
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

const WEEKDAY_LABELS_UZ = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];

const MONTH_LABELS_UZ = [
  "Yan",
  "Fev",
  "Mar",
  "Apr",
  "May",
  "Iyn",
  "Iyl",
  "Avg",
  "Sen",
  "Okt",
  "Noy",
  "Dek",
];

const specialistStatisticsDays = (period: SpecialistStatisticsPeriod) => {
  if (period === "today") return 1;
  if (period === "week") return 7;
  return 30;
};

const formatActivityLabel = (value: unknown): string => {
  if (typeof value === "number" && value >= 0 && value <= 6) {
    return WEEKDAY_LABELS_UZ[value] ?? "—";
  }

  if (typeof value !== "string" || !value.trim()) return "—";

  const trimmed = value.trim();
  const parsed = parseISO(trimmed.length === 10 ? `${trimmed}T00:00:00` : trimmed);
  if (isValid(parsed)) {
    return WEEKDAY_LABELS_UZ[parsed.getDay()];
  }

  if (trimmed.length <= 4) return trimmed;
  return formatChartDate(trimmed);
};

const formatRatingDate = (value: unknown): string => {
  if (typeof value !== "string" || !value.trim()) return "—";
  const parsed = parseISO(value);
  if (!isValid(parsed)) return value.trim();
  return format(parsed, "dd.MM.yyyy");
};

const parseAverageDurationHours = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value > 24) return Math.round((value / 60) * 10) / 10;
    return Math.round(value * 10) / 10;
  }

  if (typeof value === "string" && value.trim()) {
    const numeric = Number(value.replace(/[^\d.]/g, ""));
    if (!Number.isFinite(numeric)) return 0;
    if (value.toLowerCase().includes("daqiqa") || numeric > 24) {
      return Math.round((numeric / 60) * 10) / 10;
    }
    return Math.round(numeric * 10) / 10;
  }

  return 0;
};

const parseSuccessRatePercent = (value: unknown): number => {
  const numeric = toNumber(value);
  if (numeric <= 0) return 0;
  if (numeric <= 1) return Math.round(numeric * 1000) / 10;
  return Math.round(Math.min(numeric, 100) * 10) / 10;
};

const parseAverageRating = (value: unknown): number => {
  const numeric = toNumber(value);
  if (numeric <= 0) return 0;
  return Math.round(Math.min(numeric, 5) * 10) / 10;
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

export const normalizeSpecialistWeeklyActivity = (
  payload: unknown,
): SpecialistWeeklyActivityPoint[] => {
  return extractArray(payload)
    .map((entry, index) => {
      if (!isRecord(entry)) return null;

      const label = formatActivityLabel(
        entry.day ??
          entry.label ??
          entry.date ??
          entry.name ??
          entry.month ??
          index,
      );
      const value = toNumber(
        entry.value ?? entry.count ?? entry.completed ?? entry.total,
      );

      return { label, value };
    })
    .filter((row): row is SpecialistWeeklyActivityPoint => row !== null);
};

export const normalizeSpecialistDetailStatistics = (
  payload: unknown,
): SpecialistDetailStatistics => {
  const root = isRecord(payload) ? payload : {};
  const data = isRecord(root.data) ? root.data : root;
  const block = isRecord(data) ? data : {};
  const summary = isRecord(block.summary) ? block.summary : block;
  const stats = isRecord(block.stats) ? block.stats : summary;

  const completed = toNumber(
    stats.completed ??
      stats.completedCount ??
      stats.totalCompleted ??
      stats.done,
  );
  const averageRating = parseAverageRating(
    stats.averageRating ??
      stats.avgRating ??
      stats.rating ??
      stats.averageScore,
  );
  const averageDurationHours = parseAverageDurationHours(
    stats.averageDuration ??
      stats.avgDuration ??
      stats.averageTime ??
      stats.averageHours,
  );
  const successRate = parseSuccessRatePercent(
    stats.successRate ?? stats.success ?? stats.efficiency ?? stats.performance,
  );

  const weeklyActivity = normalizeSpecialistWeeklyActivity(
    block.weeklyActivity ??
      block.weekly ??
      block.activity ??
      block.daily ??
      block.chart ??
      block.series,
  );

  const recentRatings = extractArray(
    block.recentRatings ?? block.ratings ?? block.reviews ?? block.feedback,
  )
    .map((entry, index) => {
      if (!isRecord(entry)) return null;

      const rating = toNumber(entry.rating ?? entry.score ?? entry.stars);
      if (rating <= 0) return null;

      return {
        comment:
          (typeof entry.comment === "string" && entry.comment.trim()) ||
          (typeof entry.text === "string" && entry.text.trim()) ||
          "—",
        rating: Math.min(rating, 5),
        date: formatRatingDate(
          entry.date ?? entry.createdAt ?? entry.ratedAt ?? entry.timestamp,
        ),
      };
    })
    .filter((row): row is SpecialistRecentRating => row !== null);

  const badges = extractArray(
    block.badges ?? block.achievements ?? block.awards,
  )
    .map((entry, index) => {
      if (!isRecord(entry)) return null;

      const title =
        (typeof entry.title === "string" && entry.title.trim()) ||
        (typeof entry.name === "string" && entry.name.trim()) ||
        "Yutuq";

      return {
        id:
          (typeof entry.id === "string" && entry.id) ||
          (typeof entry._id === "string" && entry._id) ||
          `badge-${index}`,
        title,
        description:
          (typeof entry.description === "string" && entry.description.trim()) ||
          "—",
        unlocked: entry.unlocked !== false && entry.locked !== true,
      };
    })
    .filter((row): row is SpecialistAchievementBadge => row !== null);

  return {
    completed,
    averageRating,
    averageDurationHours,
    successRate,
    weeklyActivity,
    recentRatings,
    badges,
  };
};

export const normalizeMonthlyStatistics = (
  payload: unknown,
): SpecialistWeeklyActivityPoint[] => {
  return extractArray(payload)
    .map((entry, index) => {
      if (!isRecord(entry)) return null;

      const monthNumber = toNumber(entry.month);
      const label =
        typeof entry.label === "string" && entry.label.trim()
          ? entry.label.trim()
          : monthNumber >= 1 && monthNumber <= 12
            ? MONTH_LABELS_UZ[monthNumber - 1]
            : typeof entry.name === "string"
              ? entry.name
              : `Oy ${index + 1}`;

      const value = toNumber(
        entry.completed ?? entry.count ?? entry.value ?? entry.total,
      );

      return { label, value };
    })
    .filter((row): row is SpecialistWeeklyActivityPoint => row !== null);
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

const normalizeDashboardStatistics = (payload: unknown): DashboardStatistics => {
  if (!isRecord(payload)) return {};
  const requests = payload.requests;
  if (!isRecord(requests)) return { requests: undefined };

  return {
    requests: {
      total: toNumber(requests.total),
      new: toNumber(requests.new),
      inProgress: toNumber(requests.inProgress),
      completed: toNumber(requests.completed),
      verified: toNumber(requests.verified),
      rejected: toNumber(requests.rejected),
      today: toNumber(requests.today),
      thisMonth: toNumber(requests.thisMonth),
    },
  };
};

export const useDashboardStatistics = () => {
  return useQuery({
    queryKey: ["statistics", "dashboard"],
    queryFn: async () => {
      const response = await apiRequest<unknown>("/api/statistics/dashboard");
      return normalizeDashboardStatistics(response.data);
    },
    staleTime: 60_000,
    retry: false,
  });
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

export const useSpecialistDetailStatistics = (
  specialistId: string | null | undefined,
  period: SpecialistStatisticsPeriod = "week",
) => {
  const days = specialistStatisticsDays(period);

  return useQuery({
    queryKey: ["statistics", "specialist", specialistId, period, days],
    queryFn: async () => {
      const response = await apiRequest<unknown>(
        `/api/statistics/specialist/${specialistId}?days=${days}`,
      );
      return normalizeSpecialistDetailStatistics(response.data);
    },
    enabled: Boolean(specialistId),
    staleTime: 60_000,
    retry: false,
  });
};

export const useMonthlyStatistics = (
  year?: number,
  options: { enabled?: boolean } = {},
) => {
  const safeYear = year ?? new Date().getFullYear();

  return useQuery({
    queryKey: ["statistics", "monthly", safeYear],
    queryFn: async () => {
      const response = await apiRequest<unknown>(
        `/api/statistics/monthly?year=${safeYear}`,
      );
      return normalizeMonthlyStatistics(response.data);
    },
    enabled: options.enabled ?? true,
    staleTime: 60_000,
    retry: false,
  });
};

export const useExportStatistics = () => {
  return useMutation({
    mutationFn: downloadStatisticsExport,
  });
};
