import { ClassesPage } from "@/pages/ClassesPage";
import { createMockActor, makeClass, makeTeacher } from "@/test/mockActor";
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

describe("ClassesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSearchMock.mockReturnValue({});
    useNavigateMock.mockReturnValue(vi.fn());
    setAuth();
  });

  it("renders classes with homeroom teacher and capacity", async () => {
    const actor = createMockActor({
      isAdmin: true,
      classes: [
        makeClass({
          id: 1n,
          name: "១២A វិទ្យាសាស្ត្រ",
          homeroomTeacherId: 1n,
          enrolledCount: 20n,
          capacity: 40n,
        }),
      ],
      teachers: [makeTeacher({ id: 1n, name: "ចន្ថា សុភា" })],
    });
    useActorMock.mockReturnValue({ actor, isFetching: false });

    renderWithProviders(<ClassesPage />);

    // The desktop table and the mobile card list both render in jsdom (CSS
    // media queries do not apply), so scope assertions to the table.
    const table = await screen.findByTestId("classes.table");
    const rows = within(table);
    expect(rows.getByText("១២A វិទ្យាសាស្ត្រ")).toBeInTheDocument();
    expect(rows.getByText("ចន្ថា សុភា")).toBeInTheDocument();
    expect(rows.getByText("ថ្នាក់ទី ១២")).toBeInTheDocument();
  });

  it("shows the empty state when no classes exist", async () => {
    const actor = createMockActor({ isAdmin: true, classes: [] });
    useActorMock.mockReturnValue({ actor, isFetching: false });

    renderWithProviders(<ClassesPage />);

    await waitFor(() => {
      expect(screen.getByText("មិនទាន់មានថ្នាក់រៀនទេ")).toBeInTheDocument();
    });
  });
});
