import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { format, isValid, parseISO } from "date-fns";

import { resolveAssetUrl } from "./client";
import type { ApiSuccess, PaginationInfo } from "./client";
import { apiRequest } from "./client";
import type { OrganizationRef } from "./requests";
import { resolveOrganizationName } from "./requests";

export type AssignmentStatus =
  | "pending"
  | "accepted"
  | "in-progress"
  | "completed"
  | "cancelled";

export type PopulatedAssignmentRequest = {
  _id: string;
  requestNumber?: string;
  description?: string;
  priority?: string;
  citizen?: {
    name?: string;
    phone?: string;
  };
  organization?: OrganizationRef;
  address?: {
    full?: string;
  };
  images?: string[];
  createdAt?: string;
  completionData?: {
    images?: string[];
    report?: string;
    signature?: string;
    completedAt?: string;
  };
  rating?: {
    score?: number | null;
    comment?: string | null;
  };
};

export type AssignmentRequestRef =
  | string
  | {
      _id: string;
      requestNumber?: string;
    }
  | PopulatedAssignmentRequest;

export type AssignmentUserRef =
  | string
  | {
      _id: string;
      profile?: {
        firstName?: string;
        lastName?: string;
      };
      phone?: string;
    };

export type Assignment = {
  _id: string;
  request: AssignmentRequestRef;
  specialist: AssignmentUserRef;
  assignedBy?: string;
  status: AssignmentStatus;
  notes?: string;
  estimatedTime?: number;
  actualTime?: number;
  distance?: number;
  assignedAt?: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
};

export type AssignmentsQueryParams = {
  page?: number;
  limit?: number;
  status?: AssignmentStatus;
  specialistId?: string;
};

export type AssignmentsListResponse = ApiSuccess<Assignment[]> & {
  pagination?: PaginationInfo;
};

export type CreateAssignmentInput = {
  requestId: string;
  specialistId: string;
  notes?: string;
  estimatedTime?: number;
};

export type CancelAssignmentInput = {
  id: string;
  reason?: string;
};

export type MyAssignmentsHistoryParams = {
  page?: number;
  limit?: number;
};

export type SpecialistTaskUiStatus = "new" | "in-progress";

export type SpecialistTask = {
  assignmentId: string;
  requestId: string;
  assignmentStatus: AssignmentStatus;
  requestNumber: string;
  organization: string;
  address: string;
  distance: string;
  time: string;
  status: SpecialistTaskUiStatus;
  urgent?: boolean;
  description: string;
  phone: string;
  imageUrl?: string;
};

export type SpecialistHistoryItem = {
  assignmentId: string;
  id: string;
  organization: string;
  address: string;
  description: string;
  completedDate: string;
  completedTime: string;
  duration: string;
  rating: number;
  citizenComment: string;
  report: string;
  startTime: string;
  endTime: string;
  requestImages: string[];
  completionImages: string[];
  signatureUrl?: string;
};

const MY_ASSIGNMENTS_HISTORY_DEFAULT_LIMIT = 10;

export type AssignmentFilterOption<T extends string = string> = {
  value: T;
  label: string;
};

export const ASSIGNMENT_STATUS_OPTIONS: AssignmentFilterOption<AssignmentStatus>[] =
  [
    { value: "pending", label: "Kutilmoqda" },
    { value: "accepted", label: "Qabul qilindi" },
    { value: "in-progress", label: "Bajarilmoqda" },
    { value: "completed", label: "Yakunlangan" },
    { value: "cancelled", label: "Bekor qilingan" },
  ];

const buildAssignmentsQueryString = (params: AssignmentsQueryParams) => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.specialistId) searchParams.set("specialistId", params.specialistId);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const resolveAssignmentRequestId = (
  request: AssignmentRequestRef | undefined,
): string | undefined => {
  if (!request) return undefined;
  if (typeof request === "string") return request;
  return request._id;
};

export const resolveAssignmentRequestNumber = (
  request: AssignmentRequestRef | undefined,
): string => {
  if (!request) return "—";
  if (typeof request === "string") return request;
  return request.requestNumber ?? request._id ?? "—";
};

export const resolvePopulatedAssignmentRequest = (
  request: AssignmentRequestRef | undefined,
): PopulatedAssignmentRequest | undefined => {
  if (!request || typeof request === "string") return undefined;
  return request;
};

export const getSpecialistTaskUiStatus = (
  status: AssignmentStatus,
): SpecialistTaskUiStatus =>
  status === "pending" ? "new" : "in-progress";

export const formatAssignmentRelativeTime = (
  isoDate: string | undefined,
): string => {
  if (!isoDate) return "—";

  const parsed = parseISO(isoDate);
  if (!isValid(parsed)) return "—";

  const diffMs = Date.now() - parsed.getTime();
  if (diffMs < 60_000) return "Hozirgina";

  const diffMinutes = Math.floor(diffMs / 60_000);
  if (diffMinutes < 60) return `${diffMinutes} daqiqa oldin`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} soat oldin`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} kun oldin`;
};

const formatAssignmentDuration = (
  actualTimeMinutes: number | undefined,
  assignedAt: string | undefined,
  completedAt: string | undefined,
): string => {
  if (actualTimeMinutes != null && actualTimeMinutes > 0) {
    const hours = Math.floor(actualTimeMinutes / 60);
    const minutes = actualTimeMinutes % 60;
    if (hours > 0 && minutes > 0) {
      return `${hours} soat ${minutes} daqiqa`;
    }
    if (hours > 0) return `${hours} soat`;
    return `${minutes} daqiqa`;
  }

  if (assignedAt && completedAt) {
    const start = parseISO(assignedAt);
    const end = parseISO(completedAt);
    if (isValid(start) && isValid(end)) {
      const diffMinutes = Math.max(
        0,
        Math.round((end.getTime() - start.getTime()) / 60_000),
      );
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      if (hours > 0 && minutes > 0) {
        return `${hours} soat ${minutes} daqiqa`;
      }
      if (hours > 0) return `${hours} soat`;
      return `${minutes} daqiqa`;
    }
  }

  return "—";
};

export const mapAssignmentToSpecialistTask = (
  assignment: Assignment,
  organizationNameById: Map<string, string> = new Map(),
): SpecialistTask => {
  const request = resolvePopulatedAssignmentRequest(assignment.request);
  const organization = resolveOrganizationName(
    request?.organization,
    organizationNameById,
  );
  const address = request?.address?.full?.trim() || "—";
  const phone = request?.citizen?.phone?.trim() || "—";
  const description =
    request?.description?.trim() || assignment.notes?.trim() || "—";
  const distance =
    assignment.distance != null
      ? `${assignment.distance} km narida`
      : "—";
  const time = formatAssignmentRelativeTime(
    assignment.assignedAt ?? request?.createdAt,
  );
  const priority = request?.priority;
  const imagePath = request?.images?.[0];
  const imageUrl = imagePath ? resolveAssetUrl(imagePath) : undefined;

  const requestId = resolveAssignmentRequestId(assignment.request);

  return {
    assignmentId: assignment._id,
    requestId: requestId ?? "",
    assignmentStatus: assignment.status,
    requestNumber: resolveAssignmentRequestNumber(assignment.request),
    organization,
    address,
    distance,
    time,
    status: getSpecialistTaskUiStatus(assignment.status),
    urgent: priority === "urgent" || priority === "high",
    description,
    phone,
    imageUrl,
  };
};

export const mapAssignmentToSpecialistHistoryItem = (
  assignment: Assignment,
  organizationNameById: Map<string, string> = new Map(),
): SpecialistHistoryItem => {
  const request = resolvePopulatedAssignmentRequest(assignment.request);
  const organization = resolveOrganizationName(
    request?.organization,
    organizationNameById,
  );
  const address = request?.address?.full?.trim() || "—";
  const completedAt = assignment.completedAt;
  const parsedCompleted = completedAt ? parseISO(completedAt) : null;
  const completedDate =
    parsedCompleted && isValid(parsedCompleted)
      ? format(parsedCompleted, "dd.MM.yyyy")
      : "—";
  const completedTime =
    parsedCompleted && isValid(parsedCompleted)
      ? format(parsedCompleted, "HH:mm")
      : "—";
  const parsedStarted = assignment.startedAt
    ? parseISO(assignment.startedAt)
    : assignment.acceptedAt
      ? parseISO(assignment.acceptedAt)
      : assignment.assignedAt
        ? parseISO(assignment.assignedAt)
        : null;
  const startTime =
    parsedStarted && isValid(parsedStarted)
      ? format(parsedStarted, "HH:mm")
      : "—";

  const completion = request?.completionData;
  const ratingScore = request?.rating?.score;
  const rating =
    typeof ratingScore === "number" && ratingScore > 0 ? ratingScore : 0;
  const citizenComment = request?.rating?.comment?.trim() || "";
  const report =
    completion?.report?.trim() ||
    assignment.notes?.trim() ||
    request?.description?.trim() ||
    "—";
  const description = request?.description?.trim() || "—";

  const requestImages = (request?.images ?? [])
    .map((path) => resolveAssetUrl(path))
    .filter((url): url is string => Boolean(url));
  const completionImages = (completion?.images ?? [])
    .map((path) => resolveAssetUrl(path))
    .filter((url): url is string => Boolean(url));
  const signatureUrl = completion?.signature
    ? resolveAssetUrl(completion.signature)
    : undefined;

  return {
    assignmentId: assignment._id,
    id: resolveAssignmentRequestNumber(assignment.request),
    organization,
    address,
    description,
    completedDate,
    completedTime,
    duration: formatAssignmentDuration(
      assignment.actualTime,
      assignment.startedAt ?? assignment.assignedAt,
      assignment.completedAt,
    ),
    rating,
    citizenComment,
    report,
    startTime,
    endTime: completedTime,
    requestImages,
    completionImages,
    signatureUrl,
  };
};

const buildMyHistoryQueryString = (params: MyAssignmentsHistoryParams) => {
  const searchParams = new URLSearchParams();
  const page = params.page ?? 1;
  const limit = params.limit ?? MY_ASSIGNMENTS_HISTORY_DEFAULT_LIMIT;

  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const invalidateAssignmentQueries = async (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["assignments"] }),
    queryClient.invalidateQueries({ queryKey: ["requests"] }),
  ]);
};

export const resolveAssignmentSpecialistId = (
  specialist: AssignmentUserRef | undefined,
): string | undefined => {
  if (!specialist) return undefined;
  if (typeof specialist === "string") return specialist;
  return specialist._id;
};

export const resolveAssignmentSpecialistName = (
  specialist: AssignmentUserRef | undefined,
  specialistNameById: Map<string, string>,
): string => {
  if (!specialist) return "—";
  if (typeof specialist === "string") {
    return specialistNameById.get(specialist) ?? "—";
  }

  const fromProfile = [specialist.profile?.firstName, specialist.profile?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fromProfile) return fromProfile;
  if (specialist.phone) return specialist.phone;
  return specialistNameById.get(specialist._id) ?? "—";
};

export const getAssignmentStatusLabel = (
  status: AssignmentStatus | string | undefined,
): string => {
  if (!status) return "—";
  const option = ASSIGNMENT_STATUS_OPTIONS.find((item) => item.value === status);
  return option?.label ?? status;
};

export const formatAssignmentDateTime = (isoDate: string | undefined): string => {
  if (!isoDate) return "—";
  const parsed = parseISO(isoDate);
  if (!isValid(parsed)) return "—";
  return format(parsed, "dd.MM.yyyy HH:mm");
};

export const canCancelAssignment = (status: AssignmentStatus | string): boolean =>
  status === "pending" || status === "accepted" || status === "in-progress";

export const useAssignments = (params: AssignmentsQueryParams = {}) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const status = params.status ?? "";
  const specialistId = params.specialistId ?? "";

  return useQuery({
    queryKey: ["assignments", { page, limit, status, specialistId }],
    queryFn: async () => {
      const response = await apiRequest<Assignment[]>(
        `/api/assignments${buildAssignmentsQueryString({
          ...params,
          page,
          limit,
        })}`,
      );

      return response as AssignmentsListResponse;
    },
    staleTime: 30_000,
    retry: false,
  });
};

export const useAssignment = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ["assignments", "detail", id],
    queryFn: async () => {
      const response = await apiRequest<Assignment>(`/api/assignments/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 30_000,
    retry: false,
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAssignmentInput) => {
      const response = await apiRequest<Assignment>("/api/assignments", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return response.data;
    },
    onSuccess: async () => {
      await invalidateAssignmentQueries(queryClient);
    },
  });
};

export const useMyCurrentAssignments = () => {
  return useQuery({
    queryKey: ["assignments", "my", "current"],
    queryFn: async () => {
      const response = await apiRequest<Assignment[]>(
        "/api/assignments/my/current",
      );
      return response as AssignmentsListResponse;
    },
    staleTime: 30_000,
    retry: false,
  });
};

export const useMyAssignmentHistory = (
  params: Omit<MyAssignmentsHistoryParams, "page"> = {},
) => {
  const limit = params.limit ?? MY_ASSIGNMENTS_HISTORY_DEFAULT_LIMIT;

  return useInfiniteQuery({
    queryKey: ["assignments", "my", "history", { limit }],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await apiRequest<Assignment[]>(
        `/api/assignments/my/history${buildMyHistoryQueryString({
          page: pageParam,
          limit,
        })}`,
      );
      return response as AssignmentsListResponse;
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const pagination = lastPage.pagination;
      if (pagination?.hasNext) return lastPageParam + 1;
      if (pagination?.pages != null && lastPageParam < pagination.pages) {
        return lastPageParam + 1;
      }
      const pageSize = pagination?.limit ?? limit;
      const items = lastPage.data ?? [];
      if (items.length >= pageSize) return lastPageParam + 1;
      return undefined;
    },
    staleTime: 30_000,
    retry: false,
  });
};

export const useAcceptAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest<Assignment>(
        `/api/assignments/${id}/accept`,
        { method: "PUT" },
      );
      return response.data;
    },
    onSuccess: async () => {
      await invalidateAssignmentQueries(queryClient);
    },
  });
};

export const useStartAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest<Assignment>(
        `/api/assignments/${id}/start`,
        { method: "PUT" },
      );
      return response.data;
    },
    onSuccess: async () => {
      await invalidateAssignmentQueries(queryClient);
    },
  });
};

export const useCancelAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: CancelAssignmentInput) => {
      const response = await apiRequest<Assignment>(
        `/api/assignments/${id}/cancel`,
        {
          method: "PUT",
          body: JSON.stringify(reason ? { reason } : {}),
        },
      );

      return response.data;
    },
    onSuccess: async () => {
      await invalidateAssignmentQueries(queryClient);
    },
  });
};
