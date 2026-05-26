import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  isStandalonePwa,
  shouldBypassSpecialistInstallWall,
  shouldEnableSpecialistPwa,
} from "./pwa";

const stubBrowserGlobals = (options: {
  mobile?: boolean;
  standalone?: boolean;
  iosStandalone?: boolean;
}) => {
  const matchMedia = vi.fn((query: string) => ({
    matches:
      (options.mobile && query.includes("max-width: 767px")) ||
      (options.standalone && query.includes("display-mode: standalone")),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

  vi.stubGlobal("window", {
    matchMedia,
    navigator: {
      standalone: options.iosStandalone ?? false,
    },
  });
  vi.stubGlobal("matchMedia", matchMedia);
};

describe("shouldBypassSpecialistInstallWall", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns true in development mode", () => {
    vi.stubEnv("DEV", true);
    vi.stubEnv("VITE_BYPASS_SPECIALIST_PWA_WALL", "");

    expect(shouldBypassSpecialistInstallWall()).toBe(true);
  });

  it("returns true when bypass env flag is set", () => {
    vi.stubEnv("DEV", false);
    vi.stubEnv("VITE_BYPASS_SPECIALIST_PWA_WALL", "true");

    expect(shouldBypassSpecialistInstallWall()).toBe(true);
  });

  it("returns false in production without bypass flag", () => {
    vi.stubEnv("DEV", false);
    vi.stubEnv("VITE_BYPASS_SPECIALIST_PWA_WALL", "");

    expect(shouldBypassSpecialistInstallWall()).toBe(false);
  });
});

describe("shouldEnableSpecialistPwa", () => {
  beforeEach(() => {
    stubBrowserGlobals({ mobile: true });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("enables PWA for specialist on mobile when wall is not bypassed", () => {
    vi.stubEnv("DEV", false);
    vi.stubEnv("VITE_BYPASS_SPECIALIST_PWA_WALL", "");

    expect(shouldEnableSpecialistPwa("specialist")).toBe(true);
  });

  it("disables PWA for non-specialist roles", () => {
    vi.stubEnv("DEV", false);
    vi.stubEnv("VITE_BYPASS_SPECIALIST_PWA_WALL", "");

    expect(shouldEnableSpecialistPwa("manager")).toBe(false);
  });

  it("disables PWA when bypass wall is active", () => {
    vi.stubEnv("DEV", true);

    expect(shouldEnableSpecialistPwa("specialist")).toBe(false);
  });
});

describe("isStandalonePwa", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("detects standalone display mode", () => {
    stubBrowserGlobals({ standalone: true });

    expect(isStandalonePwa()).toBe(true);
  });

  it("detects iOS navigator.standalone", () => {
    stubBrowserGlobals({ iosStandalone: true });

    expect(isStandalonePwa()).toBe(true);
  });

  it("returns false when not standalone", () => {
    stubBrowserGlobals({});

    expect(isStandalonePwa()).toBe(false);
  });
});
