import { describe, expect, it } from "vitest";

import { extractUploadImageUrls } from "./uploads";

describe("extractUploadImageUrls", () => {
  it("extracts paths from a string array", () => {
    expect(
      extractUploadImageUrls(["uploads/a.jpg", "uploads/b.jpg"]),
    ).toEqual(["uploads/a.jpg", "uploads/b.jpg"]);
  });

  it("extracts from urls key in upload response shape", () => {
    expect(
      extractUploadImageUrls({
        urls: [
          "https://example.com/uploads/images/a.jpg",
          "uploads/images/b.jpg",
        ],
      }),
    ).toEqual(["uploads/images/a.jpg", "uploads/images/b.jpg"]);
  });

  it("extracts from nested images and paths keys", () => {
    expect(extractUploadImageUrls({ images: ["uploads/a.jpg"] })).toEqual([
      "uploads/a.jpg",
    ]);
    expect(extractUploadImageUrls({ paths: ["uploads/b.jpg"] })).toEqual([
      "uploads/b.jpg",
    ]);
  });

  it("unwraps nested data payloads", () => {
    expect(
      extractUploadImageUrls({
        data: { urls: ["uploads/c.jpg"] },
      }),
    ).toEqual(["uploads/c.jpg"]);
  });

  it("normalizes full URL to uploads pathname", () => {
    expect(
      extractUploadImageUrls({
        url: "https://example.com/uploads/req/photo.jpg",
      }),
    ).toEqual(["uploads/req/photo.jpg"]);
  });

  it("filters empty and invalid entries", () => {
    expect(extractUploadImageUrls(["", "  ", "uploads/ok.jpg"])).toEqual([
      "uploads/ok.jpg",
    ]);
  });
});
