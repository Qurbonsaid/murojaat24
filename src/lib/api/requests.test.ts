import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildRequestsQueryString,
  formatRequestDateTime,
  formatRequestTime,
  getRequestPriorityLabel,
  getTodayDateRange,
  omitOrganizationForRole,
  resolveOrganizationId,
  resolveOrganizationName,
  toOperatorCreatePayload,
} from "./requests";

describe("getTodayDateRange", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-24T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns today and tomorrow as yyyy-MM-dd", () => {
    expect(getTodayDateRange()).toEqual({
      startDate: "2026-05-24",
      endDate: "2026-05-25",
    });
  });
});

describe("formatRequestTime", () => {
  it("formats valid ISO timestamps as HH:mm", () => {
    expect(formatRequestTime("2026-05-24T14:30:00.000Z")).toMatch(/^\d{2}:\d{2}$/);
  });

  it('returns em dash for missing or invalid values', () => {
    expect(formatRequestTime(undefined)).toBe("—");
    expect(formatRequestTime("not-a-date")).toBe("—");
  });
});

describe("formatRequestDateTime", () => {
  it("formats valid ISO timestamps as dd.MM.yyyy HH:mm", () => {
    expect(formatRequestDateTime("2026-05-24T14:30:00.000Z")).toMatch(
      /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/,
    );
  });

  it('returns em dash for missing or invalid values', () => {
    expect(formatRequestDateTime(undefined)).toBe("—");
    expect(formatRequestDateTime("not-a-date")).toBe("—");
  });
});

describe("resolveOrganizationId", () => {
  it("returns undefined when organization is missing", () => {
    expect(resolveOrganizationId(undefined)).toBeUndefined();
  });

  it("returns string id when organization is a string", () => {
    expect(resolveOrganizationId("org-1")).toBe("org-1");
  });

  it("returns _id when organization is an object", () => {
    expect(
      resolveOrganizationId({ _id: "org-2", name: "Water dept" }),
    ).toBe("org-2");
  });
});

describe("resolveOrganizationName", () => {
  const nameById = new Map([["org-1", "Suv ta'minoti"]]);

  it('returns em dash when organization is missing', () => {
    expect(resolveOrganizationName(undefined, nameById)).toBe("—");
  });

  it("looks up name when organization is an id string", () => {
    expect(resolveOrganizationName("org-1", nameById)).toBe("Suv ta'minoti");
    expect(resolveOrganizationName("unknown", nameById)).toBe("—");
  });

  it("prefers embedded name on organization object", () => {
    expect(
      resolveOrganizationName(
        { _id: "org-2", name: "Elektr tarmog'i" },
        nameById,
      ),
    ).toBe("Elektr tarmog'i");
  });
});

describe("getRequestPriorityLabel", () => {
  it("maps known priorities to Uzbek labels", () => {
    expect(getRequestPriorityLabel("urgent")).toBe("Shoshilinch");
  });

  it('returns em dash when priority is missing', () => {
    expect(getRequestPriorityLabel(undefined)).toBe("—");
  });
});

describe("omitOrganizationForRole", () => {
  it("removes organization filter for operator role", () => {
    expect(
      omitOrganizationForRole("operator", {
        organization: "org-1",
        status: "new",
      }),
    ).toEqual({ status: "new" });
  });

  it("keeps organization filter for admin role", () => {
    const params = { organization: "org-1", status: "new" };
    expect(omitOrganizationForRole("admin", params)).toBe(params);
  });
});

describe("buildRequestsQueryString", () => {
  it("returns empty string when no params are set", () => {
    expect(buildRequestsQueryString({})).toBe("");
  });

  it("serializes query params with a leading question mark", () => {
    expect(
      buildRequestsQueryString({
        page: 2,
        limit: 10,
        status: "new",
        search: "test",
      }),
    ).toBe("?page=2&limit=10&status=new&search=test");
  });
});

describe("toOperatorCreatePayload", () => {
  it("trims text fields and normalizes phone for API", () => {
    expect(
      toOperatorCreatePayload({
        fullName: "  Ali Valiyev  ",
        phone: "90 123 45 67",
        organizationId: "org-1",
        description: "  Yo'l muammosi  ",
        address: "  Amir Temur ko'chasi  ",
      }),
    ).toEqual({
      citizenName: "Ali Valiyev",
      citizenPhone: "+998901234567",
      description: "Yo'l muammosi",
      organization: "org-1",
      address: { full: "Amir Temur ko'chasi" },
    });
  });
});
