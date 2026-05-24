import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isValid, parseISO } from "date-fns";

import type { ApiSuccess, PaginationInfo } from "./client";
import { apiRequest } from "./client";

export type AssignmentStatus =
  | "pending"
  | "accepted"
  | "in-progress"
  | "completed"
  | "cancelled";

export type AssignmentRequestRef =
  | string
  | {
      _id: string;
      requestNumber?: string;
    };

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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["assignments"] }),
        queryClient.invalidateQueries({ queryKey: ["requests"] }),
      ]);
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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["assignments"] }),
        queryClient.invalidateQueries({ queryKey: ["requests"] }),
      ]);
    },
  });
};
