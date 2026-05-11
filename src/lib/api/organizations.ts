import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "./client";

export type Organization = {
  _id: string;
  name: string;
  governance: string;
};

export type OrganizationCreateInput = {
  name: string;
  governance: string;
};

export type OrganizationUpdateInput = {
  id: string;
  name?: string;
  governance?: string;
};

const organizationsQueryKey = ["organizations"] as const;

export const useOrganizations = () => {
  return useQuery({
    queryKey: organizationsQueryKey,
    queryFn: async () => {
      const response = await apiRequest<Organization[]>("/api/organizations");
      return response.data;
    },
    staleTime: 60_000,
    retry: false,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: OrganizationCreateInput) => {
      const response = await apiRequest<Organization>("/api/organizations", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: organizationsQueryKey });
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, governance }: OrganizationUpdateInput) => {
      const response = await apiRequest<Organization>(
        `/api/organizations/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({ name, governance }),
        },
      );

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: organizationsQueryKey });
    },
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest<boolean>(`/api/organizations/${id}`, {
        method: "DELETE",
      });

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: organizationsQueryKey });
    },
  });
};
