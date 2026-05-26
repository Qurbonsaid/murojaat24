import { describe, expect, it } from "vitest";

import type { StaffUser } from "./users";
import { getStaffUserDisplayName } from "./users";

describe("getStaffUserDisplayName", () => {
  it('returns em dash when user is undefined', () => {
    expect(getStaffUserDisplayName(undefined)).toBe("—");
  });

  it("joins profile first and last name", () => {
    const user: StaffUser = {
      _id: "u1",
      phone: "+998901234567",
      role: "operator",
      profile: { firstName: "Ali", lastName: "Valiyev" },
    };

    expect(getStaffUserDisplayName(user)).toBe("Ali Valiyev");
  });

  it("falls back to phone when profile name is empty", () => {
    const user: StaffUser = {
      _id: "u2",
      phone: "+998909999999",
      role: "dispatcher",
    };

    expect(getStaffUserDisplayName(user)).toBe("+998909999999");
  });
});
