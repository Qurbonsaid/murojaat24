import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError, apiRequest, resolveAssetUrl } from "./client";

const mockJsonResponse = (
  body: unknown,
  options: { ok?: boolean; status?: number; contentType?: string } = {},
) => {
  const contentType = options.contentType ?? "application/json";
  const isJson = contentType.includes("application/json");

  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: options.ok ?? true,
      status: options.status ?? 200,
      statusText: options.ok === false ? "Error" : "OK",
      headers: new Headers({ "content-type": contentType }),
      json: async () => {
        if (!isJson) throw new Error("not json");
        return body;
      },
      text: async () =>
        typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
};

describe("resolveAssetUrl", () => {
  it("returns undefined for empty input", () => {
    expect(resolveAssetUrl(undefined)).toBeUndefined();
    expect(resolveAssetUrl("  ")).toBeUndefined();
  });

  it("returns absolute URLs unchanged", () => {
    expect(resolveAssetUrl("https://cdn.example.com/a.png")).toBe(
      "https://cdn.example.com/a.png",
    );
    expect(resolveAssetUrl("data:image/png;base64,abc")).toBe(
      "data:image/png;base64,abc",
    );
  });

  it("prefixes uploads paths with API base URL", () => {
    expect(resolveAssetUrl("uploads/avatars/user.png")).toBe(
      "http://test.local/uploads/avatars/user.png",
    );
  });

  it("adds uploads segment for bare filenames", () => {
    expect(resolveAssetUrl("photo.jpg")).toBe(
      "http://test.local/uploads/photo.jpg",
    );
  });
});

describe("apiRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns envelope data on success", async () => {
    mockJsonResponse({ success: true, data: { id: "1" } });

    const result = await apiRequest<{ id: string }>("/api/test");
    expect(result).toEqual({ success: true, data: { id: "1" } });
    expect(fetch).toHaveBeenCalledWith(
      "http://test.local/api/test",
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("throws ApiError when envelope success is false", async () => {
    mockJsonResponse({ success: false, message: "Xatolik" }, { ok: true, status: 400 });

    await expect(apiRequest("/api/test")).rejects.toMatchObject({
      name: "ApiError",
      message: "Xatolik",
      status: 400,
    });
  });

  it("throws ApiError on HTTP error responses", async () => {
    mockJsonResponse({ message: "Unauthorized" }, { ok: false, status: 401 });

    await expect(apiRequest("/api/test")).rejects.toBeInstanceOf(ApiError);
    await expect(apiRequest("/api/test")).rejects.toMatchObject({
      status: 401,
      message: "Unauthorized",
    });
  });

  it("wraps raw JSON without envelope", async () => {
    mockJsonResponse({ id: "raw" });

    const result = await apiRequest<{ id: string }>("/api/test");
    expect(result).toEqual({ success: true, data: { id: "raw" } });
  });

  it("handles non-JSON success responses", async () => {
    mockJsonResponse("plain", { contentType: "text/plain" });

    const result = await apiRequest<string>("/api/test");
    expect(result).toEqual({ success: true, data: "plain" });
  });
});
