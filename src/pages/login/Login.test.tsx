// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithProviders } from "@/test/render";

import Login from "./Login";

const mockNavigate = vi.fn();
const mockMutateAsync = vi.fn();
const mockToast = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/lib/api/auth", () => ({
  getRoleRedirectPath: (role: string) =>
    role === "operator" ? "/operator-dashboard/new" : "/login",
  useCurrentUser: () => ({
    isLoading: false,
    isFetching: false,
    data: undefined,
  }),
  useLogin: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock("@/lib/pwa", () => ({
  shouldBypassSpecialistInstallWall: () => true,
}));

describe("Login", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockMutateAsync.mockClear();
    mockToast.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the sign-in form when there is no session", () => {
    renderWithProviders(<Login />);

    expect(screen.getByText("Tizimga kirish")).toBeInTheDocument();
    expect(screen.getByLabelText("Telefon raqam")).toBeInTheDocument();
    expect(screen.getByLabelText("Parol")).toBeInTheDocument();
  });

  it("navigates to role home after successful login", async () => {
    mockMutateAsync.mockResolvedValue({
      _id: "u1",
      phone: "+998901234567",
      role: "operator",
    });

    const user = userEvent.setup();
    const { container } = renderWithProviders(<Login />);
    const form = container.querySelector("form");
    expect(form).toBeTruthy();

    await user.type(screen.getByLabelText("Telefon raqam"), "901234570");
    await user.type(screen.getByLabelText("Parol"), "murojaat24");
    await user.click(
      within(form as HTMLElement).getByRole("button", { name: "Kirish" }),
    );

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        phone: "+998901234570",
        password: "murojaat24",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/operator-dashboard/new");
    });
  });
});
