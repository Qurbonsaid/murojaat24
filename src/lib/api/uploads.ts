import { useMutation } from "@tanstack/react-query";
import { apiRequest, resolveAssetUrl } from "./client";

export type AvatarUploadResult = {
  url: string;
};

const extractAvatarUrl = (data: unknown): string => {
  if (typeof data === "object" && data !== null) {
    if ("url" in data && typeof data.url === "string") {
      return data.url;
    }

    if (
      "data" in data &&
      typeof data.data === "object" &&
      data.data !== null &&
      "url" in data.data &&
      typeof data.data.url === "string"
    ) {
      return data.data.url;
    }
  }

  throw new Error("Yuklangan rasm manzili topilmadi");
};

export const uploadAvatar = async (file: File): Promise<AvatarUploadResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRequest<unknown>("/api/uploads/avatar", {
    method: "POST",
    body: formData,
  });

  const url = resolveAssetUrl(extractAvatarUrl(response.data));
  if (!url) {
    throw new Error("Yuklangan rasm manzili topilmadi");
  }

  return { url };
};

export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: uploadAvatar,
  });
};
