import { DashboardPage } from "@/pages/DashboardPage";
import {
  createMockActor,
  makeActivity,
  makeDistribution,
  makeStats,
} from "@/test/mockActor";
import { renderWithProviders } from "@/test/renderWithProviders";
import { screen, waitFor } from "@testing-library/react";
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

function setAuth() {
  useInternetIdentityMock.mockReturnValue({
    isAuthenticated: true,
    isInitializing: false,
    isLoggingIn: false,
    isLoginError: false,
    loginError: null,
    identity: null,
    login: vi.fn(),
    clear: vi.fn(),
  });
}

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setAuth();
  });

  it("renders KPI counts, class distribution, and recent activity", async () => {
    const actor = createMockActor({
      stats: makeStats({
        studentCount: 124n,
        teacherCount: 12n,
        classCount: 6n,
        enrollmentCount: 98n,
        studentsPerClass: [
          makeDistribution({
            classId: 1n,
            className: "១២A",
            studentCount: 30n,
          }),
          makeDistribution({
            classId: 2n,
            className: "១១B",
            studentCount: 20n,
          }),
        ],
      }),
      activity: [makeActivity({ id: 1n, message: "បានបន្ថែមសិស្ស សុខ ដារា" })],
    });
    useActorMock.mockReturnValue({ actor, isFetching: false });

    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("១២៤")).toBeInTheDocument();
    });
    expect(screen.getByText("១២")).toBeInTheDocument();
    expect(screen.getByText("៦")).toBeInTheDocument();
    expect(screen.getByText("៩៨")).toBeInTheDocument();

    expect(screen.getByText("១២A")).toBeInTheDocument();
    expect(screen.getByText("១១B")).toBeInTheDocument();
    expect(screen.getByText("បានបន្ថែមសិស្ស សុខ ដារា")).toBeInTheDocument();
  });

  it("shows the empty activity state when there is no activity", async () => {
    const actor = createMockActor({ stats: makeStats(), activity: [] });
    useActorMock.mockReturnValue({ actor, isFetching: false });

    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("មិនទាន់មានសកម្មភាព")).toBeInTheDocument();
    });
    expect(screen.getByText("មិនទាន់មានទិន្នន័យថ្នាក់រៀន")).toBeInTheDocument();
  });
});
