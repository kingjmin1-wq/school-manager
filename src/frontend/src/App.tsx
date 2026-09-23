/**
 * Router and provider configuration only.
 *
 * Page bodies live in `src/pages/` and are wired here. Every management route
 * is wrapped in `AdminGate`, which requires sign-in before the page shell
 * renders.
 */

import { UserRole } from "@/backend";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useAdminAccess, useAuth } from "@/hooks/useAuth";
import { useAssignUserRole, useCallerRole } from "@/hooks/useQueries";
import { ClassDetailPage } from "@/pages/ClassDetailPage";
import { ClassesPage } from "@/pages/ClassesPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { StudentDetailPage } from "@/pages/StudentDetailPage";
import { StudentsPage } from "@/pages/StudentsPage";
import { TeacherDetailPage } from "@/pages/TeacherDetailPage";
import { TeachersPage } from "@/pages/TeachersPage";
import { Principal } from "@icp-sdk/core/principal";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Loader2, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import { type ReactNode, useState } from "react";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/* Route scaffolding                                                           */
/* -------------------------------------------------------------------------- */

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

/** Admin settings: shows the caller's role and lets an admin assign roles. */
function SettingsPage() {
  const { data: role, isLoading } = useCallerRole();
  const assignRole = useAssignUserRole();
  const [principalText, setPrincipalText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = principalText.trim();
    if (!trimmed) {
      setError("សូមបញ្ចូលលេខសម្គាល់អ្នកប្រើប្រាស់។");
      return;
    }
    let user: Principal;
    try {
      user = Principal.fromText(trimmed);
    } catch {
      setError("លេខសម្គាល់អ្នកប្រើប្រាស់មិនត្រឹមត្រូវ។");
      return;
    }
    setError(null);
    assignRole.mutate(
      { user, role: UserRole.admin },
      {
        onSuccess: () => {
          toast.success("បានផ្តល់សិទ្ធិអ្នកគ្រប់គ្រងរួចរាល់");
          setPrincipalText("");
        },
        onError: () => setError("មិនអាចផ្តល់សិទ្ធិបានទេ។"),
      },
    );
  };

  return (
    <div className="space-y-4" data-ocid="settings.page">
      <div className="space-y-1">
        <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
          ការកំណត់ប្រព័ន្ធ
        </h2>
        <p className="text-sm text-muted-foreground">
          គ្រប់គ្រងសិទ្ធិចូលប្រើប្រាស់របស់អ្នកប្រើប្រាស់ក្នុងប្រព័ន្ធ។
        </p>
      </div>

      <Card className="rounded-lg border-border shadow-none">
        <CardContent className="space-y-3 p-4">
          <h3 className="font-display text-sm font-bold tracking-tight">
            សិទ្ធិរបស់អ្នក
          </h3>
          {isLoading ? (
            <Skeleton className="h-6 w-32 rounded-md" />
          ) : (
            <p
              className="flex items-center gap-2 text-sm"
              data-ocid="settings.caller_role"
            >
              <ShieldCheck
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              {role === "admin" ? "អ្នកគ្រប់គ្រង" : "អ្នកប្រើប្រាស់ធម្មតា"}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-lg border-border shadow-none">
        <CardContent className="space-y-4 p-4">
          <div className="space-y-1">
            <h3 className="font-display text-sm font-bold tracking-tight">
              ផ្តល់សិទ្ធិអ្នកគ្រប់គ្រង
            </h3>
            <p className="text-sm text-muted-foreground">
              បញ្ចូលលេខសម្គាល់ (Principal) របស់អ្នកប្រើប្រាស់ដើម្បីផ្តល់សិទ្ធិអ្នកគ្រប់គ្រង។
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="settings-principal">លេខសម្គាល់អ្នកប្រើប្រាស់</Label>
              <Input
                id="settings-principal"
                value={principalText}
                onChange={(event) => setPrincipalText(event.target.value)}
                placeholder="ឧ. aaaaa-aa"
                autoComplete="off"
                data-ocid="settings.principal_input"
                className="rounded-md"
              />
            </div>
            {error && (
              <p
                role="alert"
                data-ocid="settings.error_state"
                className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
              >
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={assignRole.isPending}
              data-ocid="settings.assign_button"
              className="rounded-md"
            >
              {assignRole.isPending && (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              )}
              ផ្តល់សិទ្ធិអ្នកគ្រប់គ្រង
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Routes                                                                      */
/* -------------------------------------------------------------------------- */

function AdminGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing, isLoggingIn, login } = useAuth();
  const { isAdmin, isLoading } = useAdminAccess();

  if (isInitializing || isLoading) {
    return (
      <div className="space-y-3" data-ocid="admin.loading_state">
        <Skeleton className="h-8 w-56 rounded-md" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card
        className="mx-auto max-w-md rounded-lg border-border shadow-none"
        data-ocid="admin.auth_required"
      >
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-muted">
            <Lock className="size-5 text-muted-foreground" aria-hidden="true" />
          </span>
          <h2 className="font-display text-lg font-bold tracking-tight">
            ត្រូវការការចូលប្រើប្រាស់
          </h2>
          <p className="text-sm text-muted-foreground">
            សូមចូលប្រើប្រាស់ដើម្បីមើលផ្ទាំងគ្រប់គ្រងនេះ។
          </p>
          <Button
            type="button"
            onClick={() => login()}
            disabled={isLoggingIn}
            data-ocid="admin.login_button"
            className="rounded-md"
          >
            {isLoggingIn ? "កំពុងចូល…" : "ចូលប្រើប្រាស់"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card
        className="mx-auto max-w-md rounded-lg border-border shadow-none"
        data-ocid="admin.denied_state"
      >
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-muted">
            <ShieldAlert
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
          <h2 className="font-display text-lg font-bold tracking-tight">
            គ្មានសិទ្ធិចូលប្រើប្រាស់
          </h2>
          <p className="text-sm text-muted-foreground">
            ផ្ទាំងនេះសម្រាប់តែអ្នកគ្រប់គ្រងប៉ុណ្ណោះ។
          </p>
          <Button
            type="button"
            variant="outline"
            asChild
            className="rounded-md"
          >
            <Link to="/" data-ocid="admin.back_button">
              ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

/* -------------------------------------------------------------------------- */
/* Routes                                                                      */
/* -------------------------------------------------------------------------- */

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <AdminGate>
      <DashboardPage />
    </AdminGate>
  ),
});

const studentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students",
  validateSearch: (
    search: Record<string, unknown>,
  ): { q?: string; classId?: string; status?: string } => ({
    q: typeof search.q === "string" ? search.q : undefined,
    classId: typeof search.classId === "string" ? search.classId : undefined,
    status: typeof search.status === "string" ? search.status : undefined,
  }),
  component: () => (
    <AdminGate>
      <StudentsPage />
    </AdminGate>
  ),
});

const studentDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students/$id",
  component: () => (
    <AdminGate>
      <StudentDetailPage />
    </AdminGate>
  ),
});

const teachersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teachers",
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: () => (
    <AdminGate>
      <TeachersPage />
    </AdminGate>
  ),
});

const teacherDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teachers/$id",
  component: () => (
    <AdminGate>
      <TeacherDetailPage />
    </AdminGate>
  ),
});

const classesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/classes",
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: () => (
    <AdminGate>
      <ClassesPage />
    </AdminGate>
  ),
});

const classDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/classes/$id",
  component: () => (
    <AdminGate>
      <ClassDetailPage />
    </AdminGate>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <AdminGate>
      <SettingsPage />
    </AdminGate>
  ),
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  studentsRoute,
  studentDetailRoute,
  teachersRoute,
  teacherDetailRoute,
  classesRoute,
  classDetailRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
