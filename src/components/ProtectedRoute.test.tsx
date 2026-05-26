// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";

import { ApiError } from "@/lib/api/client";
import { renderWithProviders } from "@/test/render";

import ProtectedRoute from "./ProtectedRoute";

const mockUseCurrentUser = vi.fn();

vi.mock("@/lib/api/auth", () => ({
  useCurrentUser: () => mockUseCurrentUser(),
}));

const renderProtected = (requiredRoles?: Array<"operator" | "manager">) =>
  renderWithProviders(
    <Routes>
      <Route path="/login" element={<div>Login page</div>} />
      <Route
        path="/secret"
        element={
          <ProtectedRoute requiredRoles={requiredRoles}>
            <div>Protected content</div>
          </ProtectedRoute>
        }
      />
    </Routes>,
    { route: "/secret" },
  );

describe("ProtectedRoute", () => {
  it("shows loading skeleton while session loads", () => {
    mockUseCurrentUser.mockReturnValue({
      isLoading: true,
      error: null,
      data: undefined,
    });

    renderProtected();

    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
    expect(document.querySelector(".animate-pulse")).toBeTruthy();
  });

  it("redirects to login on 401", async () => {
    mockUseCurrentUser.mockReturnValue({
      isLoading: false,
      error: new ApiError("Unauthorized", 401),
      data: undefined,
    });

    renderProtected();

    expect(await screen.findByText("Login page")).toBeInTheDocument();
  });

  it("renders forbidden when role is not allowed", () => {
    mockUseCurrentUser.mockReturnValue({
      isLoading: false,
      error: null,
      data: { _id: "u1", phone: "+998901234567", role: "operator" },
    });

    renderProtected(["manager"]);

    expect(screen.getByText("Ruxsat yo'q")).toBeInTheDocument();
  });

  it("renders children when role is allowed", () => {
    mockUseCurrentUser.mockReturnValue({
      isLoading: false,
      error: null,
      data: { _id: "u1", phone: "+998901234567", role: "manager" },
    });

    renderProtected(["manager"]);

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });
});
