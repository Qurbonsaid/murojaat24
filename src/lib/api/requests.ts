import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, format, isValid, parseISO, subDays } from "date-fns";

import { normalizePhone } from "@/lib/phone";

import type { UserRole } from "./auth";
import type { ApiSuccess, PaginationInfo } from "./client";
import { apiRequest } from "./client";

export type OrganizationRef =
  | {
      _id: string;
      name: string;
      governance?: string;
    }
  | string
  | null;

export type RequestStatus =
  | "new"
  | "assigned"
  | "in-progress"
  | "completed"
  | "verified"
  | "rejected";

export type RequestPriority = "low" | "medium" | "high" | "urgent";

export type AppealRequestListItem = {
  _id?: string;
  requestNumber: string;
  status: string;
  priority?: RequestPriority;
  organization?: OrganizationRef;
  citizen?: {
    name: string;
    phone: string;
  };
  description?: string;
  createdAt?: string;
  assignment?: unknown;
};

export type AppealRequestAddress = {
  full?: string;
  region?: string;
  district?: string;
  street?: string;
  house?: string;
  coordinates?: {
    lat?: number | null;
    lng?: number | null;
  };
};

export type AppealRequestTimelineEntry = {
  status: string;
  timestamp?: string;
  comment?: string | null;
};

export type AppealRequestDetail = AppealRequestListItem & {
  address?: AppealRequestAddress;
  images?: string[];
  timeline?: AppealRequestTimelineEntry[];
  updatedAt?: string;
};

export type RequestsQueryParams = {
  page?: number;
  limit?: number;
  status?: string;
  organization?: string;
  priority?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export type RequestsListResponse = ApiSuccess<AppealRequestListItem[]> & {
  pagination?: PaginationInfo;
};

export type UseRequestsOptions = {
  enabled?: boolean;
  role?: UserRole;
};

export type OperatorCreateRequestInput = {
  citizenName: string;
  citizenPhone: string;
  description: string;
  organization: string;
  address: { full: string };
};

export type AppealRequest = {
  requestNumber: string;
  status?: string;
  citizen?: {
    name: string;
    phone: string;
  };
};

export type OperatorAppealFormValues = {
  fullName: string;
  phone: string;
  organizationId: string;
  description: string;
  address: string;
};

const ROLES_WITHOUT_ORG_FILTER: UserRole[] = ["operator", "admin"];

/** Local calendar date as `yyyy-MM-dd` for API `startDate` / `endDate` filters. */
export const getTodayDateRange = (): { startDate: string; endDate: string } => {
  const startDate = format(new Date(), "yyyy-MM-dd");
  const endDate = format(addDays(new Date(), 1), "yyyy-MM-dd"); // add one day to the end date

  return { startDate, endDate };
};

/** Formats an API ISO timestamp for list display (local time). */
export const formatRequestTime = (isoDate: string | undefined): string => {
  if (!isoDate) return "—";
  const parsed = parseISO(isoDate);
  if (!isValid(parsed)) return "—";
  return format(parsed, "HH:mm");
};

/** Formats an API ISO timestamp for detail display (local date and time). */
export const formatRequestDateTime = (isoDate: string | undefined): string => {
  if (!isoDate) return "—";
  const parsed = parseISO(isoDate);
  if (!isValid(parsed)) return "—";
  return format(parsed, "dd.MM.yyyy HH:mm");
};

export const resolveOrganizationId = (
  organization: OrganizationRef | undefined
): string | undefined => {
  if (!organization) return undefined;
  if (typeof organization === "string") return organization;
  return organization._id;
};

export const resolveOrganizationName = (
  organization: OrganizationRef | undefined,
  organizationNameById: Map<string, string>
): string => {
  if (!organization) return "—";
  if (typeof organization === "string") {
    return organizationNameById.get(organization) ?? "—";
  }
  return organization.name ?? organizationNameById.get(organization._id) ?? "—";
};

const PRIORITY_LABELS: Record<RequestPriority, string> = {
  low: "Past",
  medium: "O'rtacha",
  high: "Yuqori",
  urgent: "Shoshilinch",
};

export const getRequestPriorityLabel = (
  priority: RequestPriority | undefined
): string => {
  if (!priority) return "—";
  return PRIORITY_LABELS[priority] ?? priority;
};

export const omitOrganizationForRole = (
  role: UserRole | undefined,
  params: RequestsQueryParams
): RequestsQueryParams => {
  if (!role || !ROLES_WITHOUT_ORG_FILTER.includes(role)) {
    return params;
  }

  const { organization: _organization, ...rest } = params;
  return rest;
};

export const buildRequestsQueryString = (params: RequestsQueryParams) => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.organization)
    searchParams.set("organization", params.organization);
  if (params.priority) searchParams.set("priority", params.priority);
  if (params.search) searchParams.set("search", params.search);
  if (params.startDate) searchParams.set("startDate", params.startDate);
  if (params.endDate) searchParams.set("endDate", params.endDate);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const useRequests = (
  params: RequestsQueryParams = {},
  options: UseRequestsOptions = {}
) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const sanitized = omitOrganizationForRole(options.role, params);
  const status = sanitized.status ?? "";
  const organization = sanitized.organization ?? "";
  const priority = sanitized.priority ?? "";
  const search = sanitized.search ?? "";
  const startDate = sanitized.startDate ?? "";
  const endDate = sanitized.endDate ?? "";

  return useQuery({
    queryKey: [
      "requests",
      {
        page,
        limit,
        status,
        organization,
        priority,
        search,
        startDate,
        endDate,
      },
    ],
    queryFn: async () => {
      const response = await apiRequest<AppealRequestListItem[]>(
        `/api/requests${buildRequestsQueryString({
          ...sanitized,
          page,
          limit,
        })}`
      );

      return response as RequestsListResponse;
    },
    enabled: options.enabled ?? true,
    staleTime: 30_000,
    retry: false,
  });
};

export const useRequest = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ["requests", "detail", id],
    queryFn: async () => {
      const response = await apiRequest<AppealRequestDetail>(
        `/api/requests/${id}`
      );
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 30_000,
    retry: false,
  });
};

export const toOperatorCreatePayload = (
  values: OperatorAppealFormValues
): OperatorCreateRequestInput => ({
  citizenName: values.fullName.trim(),
  citizenPhone: normalizePhone(values.phone),
  description: values.description.trim(),
  organization: values.organizationId,
  address: { full: values.address.trim() },
});

export const useCreateOperatorRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: OperatorCreateRequestInput) => {
      const response = await apiRequest<AppealRequest>(
        "/api/requests/operator",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};
