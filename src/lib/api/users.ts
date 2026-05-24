import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { UserRole } from "./auth";
import type { ApiSuccess, PaginationInfo } from "./client";
import { apiRequest } from "./client";

export type WorkStatus = "active" | "inactive" | "busy";

export type OrganizationRef =
  | {
      _id: string;
      name: string;
      governance?: string;
    }
  | string
  | null;

export type StaffUser = {
  _id: string;
  phone: string;
  role: UserRole;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string | null;
  };
  organization?: OrganizationRef;
  quarter?: string | null;
  sector?: string | null;
  status?: WorkStatus;
  isActive?: boolean;
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type UsersQueryParams = {
  page?: number;
  limit?: number;
  role?: UserRole;
  isActive?: boolean;
  search?: string;
  organizations?: string[];
  quarter?: string;
  sector?: string;
  status?: WorkStatus;
};

export type UsersListResponse = ApiSuccess<StaffUser[]> & {
  pagination?: PaginationInfo;
};

export type UserCreateInput = {
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Exclude<UserRole, "citizen">;
  organization?: string;
  quarter?: string;
  sector?: string;
};

export type UserUpdateInput = {
  id: string;
  firstName?: string;
  lastName?: string;
  role?: Exclude<UserRole, "citizen">;
  isActive?: boolean;
  organization?: string;
  quarter?: string;
  sector?: string;
};

const buildUsersQueryString = (params: UsersQueryParams) => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.role) searchParams.set("role", params.role);
  if (typeof params.isActive === "boolean") {
    searchParams.set("isActive", String(params.isActive));
  }
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.quarter) searchParams.set("quarter", params.quarter);
  if (params.sector) searchParams.set("sector", params.sector);
  if (params.organizations?.length) {
    searchParams.set("organizations", params.organizations.join(","));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const getStaffUserDisplayName = (user: StaffUser | undefined): string => {
  if (!user) return "—";
  const fromProfile = [user.profile?.firstName, user.profile?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fromProfile || user.phone || "—";
};

export const useSpecialists = (
  params: Omit<UsersQueryParams, "role"> = {},
  options: { enabled?: boolean } = {},
) => {
  return useUsers(
    {
      ...params,
      role: "specialist",
      isActive: params.isActive ?? true,
    },
    options,
  );
};

export const useUsers = (
  params: UsersQueryParams = {},
  options: { enabled?: boolean } = {},
) => {
  const page = params.page ?? 1;
  const limit = params.limit ?? 100;
  const role = params.role ?? "";
  const search = params.search ?? "";
  const isActive =
    typeof params.isActive === "boolean" ? String(params.isActive) : "";
  const status = params.status ?? "";
  const organizations = params.organizations?.join(",") ?? "";
  const quarter = params.quarter ?? "";
  const sector = params.sector ?? "";

  return useQuery({
    queryKey: [
      "users",
      {
        page,
        limit,
        role,
        search,
        isActive,
        status,
        organizations,
        quarter,
        sector,
      },
    ],
    queryFn: async () => {
      const response = await apiRequest<StaffUser[]>(
        `/api/users${buildUsersQueryString({
          ...params,
          page,
          limit,
          role: params.role,
          search: params.search,
        })}`,
      );

      return response as UsersListResponse;
    },
    enabled: options.enabled ?? true,
    staleTime: 30_000,
    retry: false,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UserCreateInput) => {
      const response = await apiRequest<StaffUser>("/api/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UserUpdateInput) => {
      const response = await apiRequest<StaffUser>(`/api/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest<null>(`/api/users/${id}`, {
        method: "DELETE",
      });

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useResetUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; newPassword: string }) => {
      const response = await apiRequest<null>(
        `/api/users/${payload.id}/reset-password`,
        {
          method: "PUT",
          body: JSON.stringify({ newPassword: payload.newPassword }),
        },
      );

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
