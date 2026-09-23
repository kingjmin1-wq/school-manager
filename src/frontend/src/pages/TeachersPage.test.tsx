import { TeachersPage } from "@/pages/TeachersPage";
import { createMockActor, makeTeacher } from "@/test/mockActor";
import { renderWithProviders } from "@/test/renderWithProviders";
import { screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  useActorMock,
  useInternetIdentityMock,
  useSearchMock,
  useNavigateMock,
} = vi.hoisted(() => ({
  useActorMock: vi.fn(),
  useInternetIdentityMock: vi.fn(),
  useSearchMock: vi.fn(),
  useNavigateMock: vi.fn(),
}));

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: useActorMock,
  useInternetIdentity: useInternetIdentityMock,
  InternetIdentityProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useSearch: useSearchMock,
    useNavigate: useNavigateMock,
    // The page renders row links; a plain anchor avoids needing a live router.
    Link: ({
      to,
      params,
      children,
      ...rest
    }: {
      to: string;
      params?: Record<string, string>;
      children: React.ReactNode;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const href = params
        ? Object.entries(params).reduce(
            (path, [key, value]) => path.replace(`$${key}`, value),
            to,
          )
        : to;
      return (
        <a href={href} {...rest}>
          {children}
        </a>
      );
    },
  };
});

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

describe("TeachersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSearchMock.mockReturnValue({});
    useNavigateMock.mockReturnValue(vi.fn());
    setAuth();
  });

  it("renders the teacher table with subject and contact details", async () => {
    const actor = createMockActor({
      isAdmin: true,
      teachers: [
        makeTeacher({
          id: 1n,
          name: "ចន្ថា សុភា",
          subject: "គណិតវិទ្យា",
          email: "sopha@school.edu.kh",
          phone: "011 222 333",
        }),
      ],
    });
    useActorMock.mockReturnValue({ actor, isFetching: false });

    renderWithProviders(<TeachersPage />);

    // The desktop table and the mobile card list both render in jsdom (CSS
    // media queries do not apply), so scope assertions to the table.
    const table = await screen.findByTestId("teacher.table");
    const rows = within(table);
    expect(rows.getByText("ចន្ថា សុភា")).toBeInTheDocument();
    expect(rows.getByText("គណិតវិទ្យា")).toBeInTheDocument();
    expect(rows.getByText("sopha@school.edu.kh")).toBeInTheDocument();
    expect(rows.getByText("011 222 333")).toBeInTheDocument();
  });

  it("shows the empty state when no teachers exist", async () => {
    const actor = createMockActor({ isAdmin: true, teachers: [] });
    useActorMock.mockReturnValue({ actor, isFetching: false });

    renderWithProviders(<TeachersPage />);

    await waitFor(() => {
      expect(screen.getByText("មិនទាន់មានគ្រូនៅឡើយ")).toBeInTheDocument();
    });
  });
});
