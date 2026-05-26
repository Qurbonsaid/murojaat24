import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./client";
import { unregisterSpecialistPwa } from "@/lib/pwa";

export type UserRole =
  | "admin"
  | "operator"
  | "dispatcher"
  | "specialist"
  | "manager";

export type UserProfile = {
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
};

export type CurrentUserOrganization =
  | {
      _id: string;
      name: string;
      governance?: string;
    }
  | string
  | null;

export type CurrentUser = {
  _id: string;
  phone: string;
  role: UserRole;
  profile?: UserProfile;
  organization?: CurrentUserOrganization;
  isActive?: boolean;
};

export type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  avatar?: string | null;
};

const roleRedirects: Record<UserRole, string> = {
  admin: "/ecosystem/modullar",
  operator: "/operator-dashboard/new",
  dispatcher: "/dispatcher-dashboard/appeals",
  specialist: "/specialist-mobile",
  manager: "/manager/nazorat",
};

const legacySessionKeys: Record<UserRole, string> = {
  admin: "operator_session",
  operator: "operator_session",
  dispatcher: "dispatcher_session",
  specialist: "specialist_session",
  manager: "manager_session",
};

const roleLabels: Record<UserRole, string> = {
  admin: "Hokimiyat",
  operator: "Operator",
  dispatcher: "Dispatcher",
  specialist: "Mutaxassis",
  manager: "Menejer",
};

const allLegacyKeys = Array.from(new Set(Object.values(legacySessionKeys)));

export const getRoleRedirectPath = (role: UserRole | string) => {
  return roleRedirects[role as UserRole] || "/login";
};

export const clearLegacySessions = () => {
  allLegacyKeys.forEach((key) => localStorage.removeItem(key));
};

export const saveLegacySession = (user: CurrentUser) => {
  const key = legacySessionKeys[user.role];
  if (!key) return;

  clearLegacySessions();

  const name = [user.profile?.firstName, user.profile?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  localStorage.setItem(
    key,
    JSON.stringify({
      name: name || user.phone,
      role: roleLabels[user.role],
    }),
  );
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await apiRequest<CurrentUser>("/api/auth/me");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { phone: string; password: string }) => {
      const response = await apiRequest<CurrentUser>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      return response.data;
    },
    onSuccess: async (user) => {
      queryClient.setQueryData(["auth", "me"], user);
      await queryClient.refetchQueries({ queryKey: ["auth", "me"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiRequest<null>("/api/auth/logout", { method: "POST" });
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      await queryClient.invalidateQueries();
      clearLegacySessions();
      void unregisterSpecialistPwa();
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfileInput) => {
      const response = await apiRequest<CurrentUser>("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      return response.data;
    },
    onSuccess: async (updatedUser, variables) => {
      queryClient.setQueryData<CurrentUser>(["auth", "me"], (currentUser) => {
        const profile = {
          ...currentUser?.profile,
          ...updatedUser.profile,
          firstName: variables.firstName,
          lastName: variables.lastName,
          avatar: variables.avatar ?? null,
        };

        return {
          ...(currentUser ?? updatedUser),
          ...updatedUser,
          profile,
        };
      });

      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useRequestOtp = () => {
  return useMutation({
    mutationFn: async (phone: string) => {
      const response = await apiRequest<{ expiresIn: number }>(
        "/api/auth/forgot-password/request",
        {
          method: "POST",
          body: JSON.stringify({ phone }),
        },
      );

      return response.data;
    },
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (payload: { phone: string; otp: string }) => {
      const response = await apiRequest<{ resetToken: string }>(
        "/api/auth/forgot-password/verify",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );

      return response.data;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (payload: {
      resetToken: string;
      newPassword: string;
    }) => {
      await apiRequest<null>("/api/auth/forgot-password/reset", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  });
};
