import { useMutation } from "@tanstack/react-query";
import { apiRequest, resolveAssetUrl } from "./client";

export type AvatarUploadResult = {
  url: string;
};

export type CompletionImagesUploadResult = {
  urls: string[];
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

export const normalizeUploadPath = (value: unknown): string | undefined => {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  const trimmed = value.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      const pathname = url.pathname.replace(/^\/+/, "");
      if (pathname.startsWith("uploads/")) {
        return pathname;
      }
      return pathname || trimmed;
    } catch {
      return trimmed;
    }
  }

  return trimmed.replace(/^\/+/, "");
};

export const extractUploadImageUrls = (data: unknown): string[] => {
  if (Array.isArray(data)) {
    return data
      .map(normalizeUploadPath)
      .filter((path): path is string => Boolean(path));
  }

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;

    if (Array.isArray(record.urls)) {
      return extractUploadImageUrls(record.urls);
    }

    if (Array.isArray(record.images)) {
      return extractUploadImageUrls(record.images);
    }

    if (Array.isArray(record.paths)) {
      return extractUploadImageUrls(record.paths);
    }

    if ("data" in record) {
      return extractUploadImageUrls(record.data);
    }

    const single = normalizeUploadPath(
      record.url ?? record.path ?? record.filePath,
    );

    if (single) {
      return [single];
    }
  }

  return [];
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

export const uploadCompletionImages = async (
  files: File[],
): Promise<string[]> => {
  if (!files.length) {
    throw new Error("Yuklash uchun rasm tanlanmadi");
  }

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await apiRequest<unknown>("/api/uploads/images", {
    method: "POST",
    body: formData,
  });

  const paths = extractUploadImageUrls(response.data);
  if (!paths.length) {
    throw new Error("Yuklangan rasm manzili topilmadi");
  }

  return paths;
};

export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: uploadAvatar,
  });
};

export const useUploadCompletionImages = () => {
  return useMutation({
    mutationFn: uploadCompletionImages,
  });
};
