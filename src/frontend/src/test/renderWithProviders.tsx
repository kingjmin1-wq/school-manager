import type { MockActor } from "@/test/mockActor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { vi } from "vitest";

/**
 * Render helper for component/integration tests.
 *
 * Two seams are mocked:
 *  - `@caffeineai/core-infrastructure`'s `useActor` returns the supplied
 *    typed actor mock, so no canister or network is involved.
 *  - `useInternetIdentity` returns a controllable auth state.
 *
 * Everything else (router, query client, Radix primitives, page components)
 * is the real production code.
 */

export type AuthState = {
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  isLoginError: boolean;
  loginError: Error | null;
  identity: { getPrincipal: () => { toText: () => string } } | null;
  login: () => void;
  clear: () => void;
};

export function makeAuthState(overrides: Partial<AuthState> = {}): AuthState {
  const principalText = "aaaaa-aa";
  return {
    isAuthenticated: true,
    isInitializing: false,
    isLoggingIn: false,
    isLoginError: false,
    loginError: null,
    identity: {
      getPrincipal: () => ({ toText: () => principalText }),
    },
    login: vi.fn(),
    clear: vi.fn(),
    ...overrides,
  };
}

/**
 * Install the module mocks. Must be called before importing `App`/pages that
 * pull in the mocked modules. Returns the actor and auth state for assertions.
 */
export function installMocks(
  actor: MockActor,
  auth: AuthState = makeAuthState(),
): { actor: MockActor; auth: AuthState } {
  vi.mock("@caffeineai/core-infrastructure", () => ({
    useActor: () => ({ actor, isFetching: false }),
    useInternetIdentity: () => auth,
    InternetIdentityProvider: ({ children }: { children: ReactNode }) =>
      children,
  }));
  return { actor, auth };
}

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: { retry: false },
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  queryClient: QueryClient = createTestQueryClient(),
): RenderResult & { queryClient: QueryClient } {
  const result = render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
  return { ...result, queryClient };
}
