import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { CurrentUser } from "./auth";
import {
  clearLegacySessions,
  getRoleRedirectPath,
  saveLegacySession,
} from "./auth";

describe("getRoleRedirectPath", () => {
  it("returns home route for each role", () => {
    expect(getRoleRedirectPath("admin")).toBe("/ecosystem/modullar");
    expect(getRoleRedirectPath("operator")).toBe("/operator-dashboard/new");
    expect(getRoleRedirectPath("dispatcher")).toBe(
      "/dispatcher-dashboard/appeals",
    );
    expect(getRoleRedirectPath("specialist")).toBe("/specialist-mobile");
    expect(getRoleRedirectPath("manager")).toBe("/manager/nazorat");
  });

  it("returns login for unknown role", () => {
    expect(getRoleRedirectPath("unknown")).toBe("/login");
  });
});

describe("legacy session storage", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const user = (role: CurrentUser["role"], overrides?: Partial<CurrentUser>) =>
    ({
      _id: "u1",
      phone: "+998901234567",
      role,
      profile: { firstName: "Ali", lastName: "Valiyev" },
      ...overrides,
    }) satisfies CurrentUser;

  it("writes role-specific session key with display name", () => {
    saveLegacySession(user("dispatcher"));

    expect(JSON.parse(storage.get("dispatcher_session")!)).toEqual({
      name: "Ali Valiyev",
      role: "Dispatcher",
    });
  });

  it("uses phone when profile name is missing", () => {
    saveLegacySession(
      user("manager", { profile: undefined, phone: "+998909999999" }),
    );

    expect(JSON.parse(storage.get("manager_session")!)).toEqual({
      name: "+998909999999",
      role: "Menejer",
    });
  });

  it("clears other legacy keys when saving a new session", () => {
    storage.set("operator_session", "{}");
    storage.set("specialist_session", "{}");

    saveLegacySession(user("specialist"));

    expect(storage.has("operator_session")).toBe(false);
    expect(storage.has("specialist_session")).toBe(true);
  });

  it("clearLegacySessions removes all known keys", () => {
    storage.set("operator_session", "{}");
    storage.set("dispatcher_session", "{}");
    storage.set("manager_session", "{}");

    clearLegacySessions();

    expect(storage.size).toBe(0);
  });
});
