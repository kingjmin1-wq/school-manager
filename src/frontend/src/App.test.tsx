import App from "@/App";
import { createMockActor } from "@/test/mockActor";
import { createTestQueryClient } from "@/test/renderWithProviders";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { useActorMock, useInternetIdentityMock } = vi.hoisted(() => ({
  useActorMock: vi.fn(),
  useInternetIdentityMock: vi.fn(),
}));

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: useActorMock,
  useInternetIdentity: useInternetIdentityMock,
  InternetIdentityProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

function renderApp() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

function setAuth(overrides: Record<string, unknown> = {}) {
  useInternetIdentityMock.mockReturnValue({
    isAuthenticated: false,
    isInitializing: false,
    isLoggingIn: false,
    isLoginError: false,
    loginError: null,
    identity: null,
    login: vi.fn(),
    clear: vi.fn(),
    ...overrides,
  });
}

describe("AdminGate access control", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, "", "/");
  });

  it("prompts unauthenticated visitors to sign in", async () => {
    const actor = createMockActor({ isAdmin: false });
    useActorMock.mockReturnValue({ actor, isFetching: false });
    setAuth({ isAuthenticated: false });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText("ត្រូវការការចូលប្រើប្រាស់")).toBeInTheDocument();
    });
    // The header also offers a sign-in button, so scope to the admin gate card.
    const gate = screen.getByText("ត្រូវការការចូលប្រើប្រាស់").closest("div");
    expect(gate).not.toBeNull();
    expect(
      within(gate as HTMLElement).getByRole("button", { name: "ចូលប្រើប្រាស់" }),
    ).toBeInTheDocument();
  });

  it("denies signed-in non-admins", async () => {
    const actor = createMockActor({ isAdmin: false });
    useActorMock.mockReturnValue({ actor, isFetching: false });
    setAuth({ isAuthenticated: true });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText("គ្មានសិទ្ធិចូលប្រើប្រាស់")).toBeInTheDocument();
    });
  });

  it("renders the dashboard for signed-in admins", async () => {
    const actor = createMockActor({ isAdmin: true });
    useActorMock.mockReturnValue({ actor, isFetching: false });
    setAuth({ isAuthenticated: true });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText("ផ្ទាំងគ្រប់គ្រងសាលា")).toBeInTheDocument();
    });
  });
});
