import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "./client";

const termo24QueryKey = ["termo24"] as const;

type UseTermo24DevicesOptions = {
  enabled?: boolean;
  refetchInterval?: number | false;
};

export type Termo24Device = {
  _id: string;
  name: string | null;
  address: {
    full: string | null;
    street: string | null;
    house: string | null;
    coordinates: {
      lat: number | null;
      lng: number | null;
    };
  };
  quarter: string | null;
  sector: string | null;
  input: number;
  output: number;
  timestamp: string;
  status: "ok" | "input_fault" | "output_fault" | "both_fault";
  createdAt: string;
  updatedAt: string;
};

export type Termo24DeviceUpdateInput = {
  id: string;
  name?: string | null;
  address?: {
    full?: string | null;
    street?: string | null;
    house?: string | null;
    coordinates?: {
      lat?: number | null;
      lng?: number | null;
    };
  };
  quarter?: string | null;
  sector?: string | null;
};

export const useTermo24Devices = ({
  enabled = true,
  refetchInterval = 30_000,
}: UseTermo24DevicesOptions = {}) => {
  return useQuery({
    queryKey: termo24QueryKey,
    queryFn: async () => {
      const response = await apiRequest<Termo24Device[]>("/api/termo24/all");
      return response.data;
    },
    enabled,
    staleTime: 60_000,
    refetchInterval,
    refetchIntervalInBackground: refetchInterval !== false,
    retry: false,
  });
};

export const useTermo24Device = (id: string | null | undefined) => {
  return useQuery({
    queryKey: [...termo24QueryKey, "detail", id],
    queryFn: async () => {
      const response = await apiRequest<Termo24Device>(`/api/termo24/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 30_000,
    retry: false,
  });
};

export const useUpdateTermo24Device = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...rest }: Termo24DeviceUpdateInput) => {
      const response = await apiRequest<{ success: boolean }>(
        `/api/termo24/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(rest),
        },
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: termo24QueryKey });
    },
  });
};
