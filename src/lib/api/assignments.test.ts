import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Assignment } from "./assignments";
import {
  canCancelAssignment,
  formatAssignmentRelativeTime,
  getAssignmentStatusLabel,
  getSpecialistTaskUiStatus,
  mapAssignmentToSpecialistHistoryItem,
  mapAssignmentToSpecialistTask,
  resolveAssignmentRequestId,
  resolveAssignmentRequestNumber,
  resolveAssignmentSpecialistName,
} from "./assignments";

const orgMap = new Map([["org-1", "Suv ta'minoti"]]);

const populatedAssignment = (
  overrides: Partial<Assignment> = {},
): Assignment => ({
  _id: "asg-1",
  status: "pending",
  specialist: "spec-1",
  distance: 2.5,
  assignedAt: "2026-05-24T10:00:00.000Z",
  request: {
    _id: "req-1",
    requestNumber: "MR-001",
    description: "Yo'l muammosi",
    priority: "urgent",
    citizen: { name: "Ali", phone: "+998901234567" },
    organization: { _id: "org-1", name: "Suv ta'minoti" },
    address: { full: "Amir Temur ko'chasi" },
    images: ["uploads/request.jpg"],
    createdAt: "2026-05-24T09:00:00.000Z",
  },
  ...overrides,
});

describe("resolveAssignmentRequestId", () => {
  it("returns undefined when request is missing", () => {
    expect(resolveAssignmentRequestId(undefined)).toBeUndefined();
  });

  it("returns string id for string ref", () => {
    expect(resolveAssignmentRequestId("req-1")).toBe("req-1");
  });

  it("returns _id for populated request", () => {
    expect(
      resolveAssignmentRequestId({ _id: "req-2", requestNumber: "MR-002" }),
    ).toBe("req-2");
  });
});

describe("resolveAssignmentRequestNumber", () => {
  it('returns em dash when request is missing', () => {
    expect(resolveAssignmentRequestNumber(undefined)).toBe("—");
  });

  it("returns request number or id fallback", () => {
    expect(
      resolveAssignmentRequestNumber({ _id: "req-1", requestNumber: "MR-001" }),
    ).toBe("MR-001");
    expect(resolveAssignmentRequestNumber("req-1")).toBe("req-1");
  });
});

describe("getSpecialistTaskUiStatus", () => {
  it("maps pending to new", () => {
    expect(getSpecialistTaskUiStatus("pending")).toBe("new");
  });

  it("maps active statuses to in-progress", () => {
    expect(getSpecialistTaskUiStatus("accepted")).toBe("in-progress");
    expect(getSpecialistTaskUiStatus("in-progress")).toBe("in-progress");
  });
});

describe("formatAssignmentRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-24T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns em dash for missing or invalid dates', () => {
    expect(formatAssignmentRelativeTime(undefined)).toBe("—");
    expect(formatAssignmentRelativeTime("invalid")).toBe("—");
  });

  it("returns Hozirgina for under one minute", () => {
    expect(formatAssignmentRelativeTime("2026-05-24T11:59:30.000Z")).toBe(
      "Hozirgina",
    );
  });

  it("returns minutes ago for under one hour", () => {
    expect(formatAssignmentRelativeTime("2026-05-24T11:30:00.000Z")).toBe(
      "30 daqiqa oldin",
    );
  });

  it("returns hours ago for under one day", () => {
    expect(formatAssignmentRelativeTime("2026-05-24T08:00:00.000Z")).toBe(
      "4 soat oldin",
    );
  });

  it("returns days ago for older timestamps", () => {
    expect(formatAssignmentRelativeTime("2026-05-22T12:00:00.000Z")).toBe(
      "2 kun oldin",
    );
  });
});

describe("canCancelAssignment", () => {
  it("allows cancel for pending, accepted, and in-progress", () => {
    expect(canCancelAssignment("pending")).toBe(true);
    expect(canCancelAssignment("accepted")).toBe(true);
    expect(canCancelAssignment("in-progress")).toBe(true);
  });

  it("disallows cancel for completed and cancelled", () => {
    expect(canCancelAssignment("completed")).toBe(false);
    expect(canCancelAssignment("cancelled")).toBe(false);
  });
});

describe("getAssignmentStatusLabel", () => {
  it("returns Uzbek label for known status", () => {
    expect(getAssignmentStatusLabel("pending")).toBe("Kutilmoqda");
  });

  it('returns em dash when status is missing', () => {
    expect(getAssignmentStatusLabel(undefined)).toBe("—");
  });
});

describe("resolveAssignmentSpecialistName", () => {
  const nameById = new Map([["spec-1", "Fallback Name"]]);

  it("looks up name by string id", () => {
    expect(resolveAssignmentSpecialistName("spec-1", nameById)).toBe(
      "Fallback Name",
    );
  });

  it("prefers profile name on populated specialist", () => {
    expect(
      resolveAssignmentSpecialistName(
        {
          _id: "spec-2",
          profile: { firstName: "Akmal", lastName: "Rahimov" },
        },
        nameById,
      ),
    ).toBe("Akmal Rahimov");
  });

  it("falls back to phone", () => {
    expect(
      resolveAssignmentSpecialistName(
        { _id: "spec-3", phone: "+998909999999" },
        nameById,
      ),
    ).toBe("+998909999999");
  });
});

describe("mapAssignmentToSpecialistTask", () => {
  it("maps populated assignment to specialist task card fields", () => {
    const task = mapAssignmentToSpecialistTask(populatedAssignment(), orgMap);

    expect(task).toMatchObject({
      assignmentId: "asg-1",
      requestId: "req-1",
      requestNumber: "MR-001",
      organization: "Suv ta'minoti",
      address: "Amir Temur ko'chasi",
      distance: "2.5 km narida",
      status: "new",
      urgent: true,
      phone: "+998901234567",
      description: "Yo'l muammosi",
    });
    expect(task.imageUrl).toBe(
      "http://test.local/uploads/request.jpg",
    );
  });

  it("marks high priority as urgent", () => {
    const task = mapAssignmentToSpecialistTask(
      populatedAssignment({
        request: {
          ...populatedAssignment().request as Exclude<
            Assignment["request"],
            string
          >,
          priority: "high",
        },
      }),
      orgMap,
    );
    expect(task.urgent).toBe(true);
  });
});

describe("mapAssignmentToSpecialistHistoryItem", () => {
  it("maps completed assignment to history row", () => {
    const item = mapAssignmentToSpecialistHistoryItem(
      populatedAssignment({
        status: "completed",
        completedAt: "2026-05-24T14:00:00.000Z",
        startedAt: "2026-05-24T11:00:00.000Z",
        actualTime: 90,
        request: {
          ...(populatedAssignment().request as Exclude<
            Assignment["request"],
            string
          >),
          rating: { score: 5, comment: "Yaxshi ish" },
          completionData: {
            report: "Bajarildi",
            images: ["uploads/done.jpg"],
            signature: "uploads/sign.png",
          },
        },
      }),
      orgMap,
    );

    expect(item).toMatchObject({
      assignmentId: "asg-1",
      id: "MR-001",
      organization: "Suv ta'minoti",
      rating: 5,
      citizenComment: "Yaxshi ish",
      report: "Bajarildi",
      duration: "1 soat 30 daqiqa",
    });
    expect(item.requestImages[0]).toBe(
      "http://test.local/uploads/request.jpg",
    );
    expect(item.completionImages[0]).toBe(
      "http://test.local/uploads/done.jpg",
    );
    expect(item.signatureUrl).toBe(
      "http://test.local/uploads/sign.png",
    );
  });
});
