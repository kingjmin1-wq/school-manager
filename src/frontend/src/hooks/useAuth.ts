/**
 * Authentication helpers built on the template's Internet Identity provider.
 *
 * The identity provider URL is injected from the deployment environment by
 * `InternetIdentityProvider`; never hardcode one here.
 */

import { useIsAdmin } from "@/hooks/useQueries";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    identity,
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    isLoginError,
    loginError,
  } = useInternetIdentity();

  const principal = identity?.getPrincipal() ?? null;

  return {
    identity,
    principal,
    principalText: principal ? principal.toText() : null,
    login,
    logout: clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    isLoginError,
    loginError,
  };
}

/** Whether the signed-in caller holds the admin role on the backend. */
export function useAdminAccess() {
  const { isAuthenticated, isInitializing } = useAuth();
  const adminQuery = useIsAdmin();

  return {
    isAdmin: adminQuery.data === true,
    isLoading: isInitializing || adminQuery.isLoading,
    isAuthenticated,
  };
}
