import { describe, expect, it } from "vitest";

import { formatPhoneInput, normalizePhone } from "./phone";

describe("normalizePhone", () => {
  it("formats 9-digit local number with +998 prefix", () => {
    expect(normalizePhone("90 123 45 67")).toBe("+998901234567");
  });

  it("strips leading 998 when digits already include country code", () => {
    expect(normalizePhone("998901234567")).toBe("+998901234567");
  });

  it("ignores non-digit characters", () => {
    expect(normalizePhone("+998 (90) 123-45-67")).toBe("+998901234567");
  });

  it("returns empty string when there are no digits", () => {
    expect(normalizePhone("   ")).toBe("");
  });
});

describe("formatPhoneInput", () => {
  it("groups digits into display format", () => {
    expect(formatPhoneInput("901234567")).toBe("+998 90 123 45 67");
  });

  it("returns empty string for empty input", () => {
    expect(formatPhoneInput("")).toBe("");
  });

  it("caps local digits at 9 after country code", () => {
    expect(formatPhoneInput("998901234567890")).toBe("+998 90 123 45 67");
  });

  it("formats partial input progressively", () => {
    expect(formatPhoneInput("90")).toBe("+998 90");
    expect(formatPhoneInput("90123")).toBe("+998 90 123");
  });
});
