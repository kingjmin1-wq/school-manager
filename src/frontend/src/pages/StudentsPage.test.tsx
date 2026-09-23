import { StudentsPage } from "@/pages/StudentsPage";
import { createMockActor, makeClass, makeStudent } from "@/test/mockActor";
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

describe("StudentsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSearchMock.mockReturnValue({});
    useNavigateMock.mockReturnValue(vi.fn());
    setAuth();
  });

  it("renders the student table with class names and status labels", async () => {
    const actor = createMockActor({
      isAdmin: true,
      students: [makeStudent({ id: 1n, name: "សុខ ដារា", classIds: [1n] })],
      classes: [makeClass({ id: 1n, name: "១២A វិទ្យាសាស្ត្រ" })],
    });
    useActorMock.mockReturnValue({ actor, isFetching: false });

    renderWithProviders(<StudentsPage />);

    // The desktop table and the mobile card list both render in jsdom (CSS
    // media queries do not apply), so scope assertions to the table.
    const table = await screen.findByTestId("student.table");
    const rows = within(table);
    expect(rows.getByText("សុខ ដារា")).toBeInTheDocument();
    expect(rows.getByText("១២A វិទ្យាសាស្ត្រ")).toBeInTheDocument();
    expect(rows.getByText("សកម្ម")).toBeInTheDocument();
    expect(rows.getByText("ប្រុស")).toBeInTheDocument();
    expect(rows.getByText("04/05/2012")).toBeInTheDocument();
  });

  it("shows the empty state when there are no students", async () => {
    const actor = createMockActor({ isAdmin: true, students: [] });
    useActorMock.mockReturnValue({ actor, isFetching: false });

    renderWithProviders(<StudentsPage />);

    await waitFor(() => {
      expect(screen.getByText("មិនទាន់មានសិស្សនៅឡើយ")).toBeInTheDocument();
    });
  });

  it("hides the add button for non-admin callers", async () => {
    const actor = createMockActor({ isAdmin: false, students: [] });
    useActorMock.mockReturnValue({ actor, isFetching: false });

    renderWithProviders(<StudentsPage />);

    await waitFor(() => {
      expect(screen.getByText("មិនទាន់មានសិស្សនៅឡើយ")).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", { name: /បន្ថែមសិស្ស/ }),
    ).not.toBeInTheDocument();
  });

  it("passes the URL search term through to the backend filter", async () => {
    useSearchMock.mockReturnValue({ q: "ដារា" });
    const actor = createMockActor({ isAdmin: true, students: [] });
    useActorMock.mockReturnValue({ actor, isFetching: false });

    renderWithProviders(<StudentsPage />);

    await waitFor(() => {
      expect(actor.listStudents).toHaveBeenCalledWith(
        expect.objectContaining({ search: "ដារា" }),
      );
    });
  });
});
