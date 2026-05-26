import { describe, expect, it } from "vitest";

import {
  buildStatisticsExportQuery,
  groupOrganizationStatisticsByGovernance,
  mapStatisticsToChartSeries,
  normalizeDailyStatistics,
  normalizeMonthlyStatistics,
  normalizeOrganizationStatistics,
  normalizeSpecialistDetailStatistics,
  normalizeSpecialistStatistics,
  normalizeSpecialistWeeklyActivity,
} from "./statistics";

describe("normalizeDailyStatistics", () => {
  it("maps array entries with date and counts", () => {
    const result = normalizeDailyStatistics([
      { date: "2026-05-01", received: 10, completed: 7 },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ received: 10, completed: 7 });
    expect(result[0].date).toMatch(/^\d{2}\.\d{2}$/);
  });

  it("unwraps nested data array", () => {
    const result = normalizeDailyStatistics({
      data: [{ day: "2026-05-02", created: 5, done: 3 }],
    });

    expect(result).toEqual([
      expect.objectContaining({ received: 5, completed: 3 }),
    ]);
  });
});

describe("normalizeOrganizationStatistics", () => {
  it("resolves organization name and count from alternate keys", () => {
    const result = normalizeOrganizationStatistics([
      {
        organizationName: "Suv",
        count: 12,
        governance: "Hokimiyat",
        organizationId: "org-1",
      },
    ]);

    expect(result).toEqual([
      {
        id: "org-1",
        name: "Suv",
        count: 12,
        governance: "Hokimiyat",
      },
    ]);
  });

  it("reads nested organization object", () => {
    const result = normalizeOrganizationStatistics([
      {
        organization: { _id: "org-2", name: "Elektr", governance: "Kommunal" },
        total: 8,
      },
    ]);

    expect(result[0]).toMatchObject({
      id: "org-2",
      name: "Elektr",
      count: 8,
      governance: "Kommunal",
    });
  });
});

describe("normalizeSpecialistWeeklyActivity", () => {
  it("maps label and value from alternate keys", () => {
    const result = normalizeSpecialistWeeklyActivity([
      { day: "2026-05-19", count: 4 },
      { label: "Dush", value: 2 },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0].value).toBe(4);
    expect(result[1]).toMatchObject({ label: "Dush", value: 2 });
  });
});

describe("normalizeSpecialistDetailStatistics", () => {
  it("parses nested summary and stats blocks", () => {
    const result = normalizeSpecialistDetailStatistics({
      summary: {
        completed: 15,
        averageRating: 4.5,
        averageDuration: "2.5",
        successRate: 0.92,
      },
      weeklyActivity: [{ label: "Dush", value: 3 }],
      recentRatings: [
        { comment: "Zo'r", rating: 5, date: "2026-05-20T10:00:00.000Z" },
      ],
      badges: [{ title: "Yulduz", description: "10 ta vazifa", unlocked: true }],
    });

    expect(result).toMatchObject({
      completed: 15,
      averageRating: 4.5,
      averageDurationHours: 2.5,
      successRate: 92,
    });
    expect(result.weeklyActivity).toHaveLength(1);
    expect(result.recentRatings[0]).toMatchObject({
      comment: "Zo'r",
      rating: 5,
    });
    expect(result.badges[0].title).toBe("Yulduz");
  });

  it("returns defaults when fields are missing", () => {
    const result = normalizeSpecialistDetailStatistics({});

    expect(result).toMatchObject({
      completed: 0,
      averageRating: 0,
      averageDurationHours: 0,
      successRate: 0,
      weeklyActivity: [],
      recentRatings: [],
      badges: [],
    });
  });
});

describe("normalizeMonthlyStatistics", () => {
  it("maps month entries to chart points", () => {
    const result = normalizeMonthlyStatistics([
      { month: 3, completed: 20 },
      { label: "Apr", value: 15 },
    ]);

    expect(result).toEqual([
      { label: "Mar", value: 20 },
      { label: "Apr", value: 15 },
    ]);
  });
});

describe("normalizeSpecialistStatistics", () => {
  it("maps specialist leaderboard rows", () => {
    const result = normalizeSpecialistStatistics([
      {
        specialistName: "Ali Valiyev",
        specialistId: "u1",
        completed: 9,
        averageDuration: "3.2 soat",
      },
    ]);

    expect(result).toEqual([
      {
        id: "u1",
        name: "Ali Valiyev",
        completed: 9,
        averageDuration: "3.2 soat",
      },
    ]);
  });
});

describe("mapStatisticsToChartSeries", () => {
  it("adds value and rotating colors", () => {
    const result = mapStatisticsToChartSeries([
      { name: "A", count: 5 },
      { name: "B", count: 3 },
    ]);

    expect(result[0]).toMatchObject({ name: "A", count: 5, value: 5 });
    expect(result[0].color).toBeTruthy();
    expect(result[1].color).not.toBe(result[0].color);
  });
});

describe("groupOrganizationStatisticsByGovernance", () => {
  it("sums counts by governance", () => {
    const result = groupOrganizationStatisticsByGovernance([
      { name: "A", count: 5, governance: "Hokimiyat" },
      { name: "B", count: 3, governance: "Hokimiyat" },
      { name: "C", count: 2 },
    ]);

    const hokimiyat = result.find((item) => item.name === "Hokimiyat");
    const boshqa = result.find((item) => item.name === "Boshqa");

    expect(hokimiyat?.value).toBe(8);
    expect(boshqa?.value).toBe(2);
  });
});

describe("buildStatisticsExportQuery", () => {
  it("serializes export filters", () => {
    expect(
      buildStatisticsExportQuery({
        startDate: "2026-05-01",
        endDate: "2026-05-31",
        organization: "org-1",
      }),
    ).toBe("?startDate=2026-05-01&endDate=2026-05-31&organization=org-1");
  });

  it("returns empty string when no params", () => {
    expect(buildStatisticsExportQuery({})).toBe("");
  });
});
