/**
 * Shared TanStack Query hooks for every backend operation.
 *
 * Reads are `useQuery`; writes are `useMutation` and invalidate the affected
 * query keys on success. `useActor(createActor)` is always called at hook top
 * level, never inside a query or mutation callback.
 */

import { createActor } from "@/backend";
import type {
  ClassFilter,
  ClassInput,
  ClassUpdate,
  EnrollmentFilter,
  EnrollmentInput,
  Id,
  StudentFilter,
  StudentInput,
  StudentUpdate,
  TeacherFilter,
  TeacherInput,
  TeacherUpdate,
  UserRole,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const queryKeys = {
  students: (filter?: StudentFilter) => ["students", filter ?? null] as const,
  student: (id: Id) => ["student", id.toString()] as const,
  teachers: (filter?: TeacherFilter) => ["teachers", filter ?? null] as const,
  teacher: (id: Id) => ["teacher", id.toString()] as const,
  classes: (filter?: ClassFilter) => ["classes", filter ?? null] as const,
  class: (id: Id) => ["class", id.toString()] as const,
  enrollments: (filter?: EnrollmentFilter) =>
    ["enrollments", filter ?? null] as const,
  dashboardStats: ["dashboardStats"] as const,
  recentActivity: (limit: number) => ["recentActivity", limit] as const,
  callerRole: ["callerRole"] as const,
  isAdmin: ["isAdmin"] as const,
};

/* -------------------------------------------------------------------------- */
/* Students                                                                    */
/* -------------------------------------------------------------------------- */

export function useStudents(filter: StudentFilter = {}) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.students(filter),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listStudents(filter);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStudent(id: Id | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.student(id ?? 0n),
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getStudent(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateStudent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: StudentInput) => {
      if (!actor) throw new Error("ប្រព័ន្ធមិនទាន់រួចរាល់");
      return actor.createStudent(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      void queryClient.invalidateQueries({ queryKey: ["recentActivity"] });
    },
  });
}

export function useUpdateStudent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, update }: { id: Id; update: StudentUpdate }) => {
      if (!actor) throw new Error("ប្រព័ន្ធមិនទាន់រួចរាល់");
      return actor.updateStudent(id, update);
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.student(variables.id),
      });
      void queryClient.invalidateQueries({ queryKey: ["recentActivity"] });
    },
  });
}

export function useDeleteStudent() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: Id) => {
      if (!actor) throw new Error("ប្រព័ន្ធមិនទាន់រួចរាល់");
      return actor.deleteStudent(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      void queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      void queryClient.invalidateQueries({ queryKey: ["recentActivity"] });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Teachers                                                                    */
/* -------------------------------------------------------------------------- */

export function useTeachers(filter: TeacherFilter = {}) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.teachers(filter),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTeachers(filter);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTeacher(id: Id | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.teacher(id ?? 0n),
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getTeacher(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateTeacher() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: TeacherInput) => {
      if (!actor) throw new Error("ប្រព័ន្ធមិនទាន់រួចរាល់");
      return actor.createTeacher(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["teachers"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      void queryClient.invalidateQueries({ queryKey: ["recentActivity"] });
    },
  });
}

export function useUpdateTeacher() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, update }: { id: Id; update: TeacherUpdate }) => {
      if (!actor) throw new Error("ប្រព័ន្ធមិនទាន់រួចរាល់");
      return actor.updateTeacher(id, update);
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["teachers"] });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.teacher(variables.id),
      });
      void queryClient.invalidateQueries({ queryKey: ["recentActivity"] });
    },
  });
}

export function useDeleteTeacher() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: Id) => {
      if (!actor) throw new Error("ប្រព័ន្ធមិនទាន់រួចរាល់");
      return actor.deleteTeacher(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["teachers"] });
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      void queryClient.invalidateQueries({ queryKey: ["recentActivity"] });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Classes                                                                     */
/* -------------------------------------------------------------------------- */

export function useClasses(filter: ClassFilter = {}) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.classes(filter),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listClasses(filter);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClass(id: Id | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.class(id ?? 0n),
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getClass(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateClass() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ClassInput) => {
      if (!actor) throw new Error("ប្រព័ន្ធមិនទាន់រួចរាល់");
      return actor.createClass(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      void queryClient.invalidateQueries({ queryKey: ["recentActivity"] });
    },
  });
}

export function useUpdateClass() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, update }: { id: Id; update: ClassUpdate }) => {
      if (!actor) throw new Error("ប្រព័ន្ធមិនទាន់រួចរាល់");
      return actor.updateClass(id, update);
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.class(variables.id),
      });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      void queryClient.invalidateQueries({ queryKey: ["recentActivity"] });
    },
  });
}

export function useDeleteClass() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: Id) => {
      if (!actor) throw new Error("ប្រព័ន្ធមិនទាន់រួចរាល់");
      return actor.deleteClass(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      void queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      void queryClient.invalidateQueries({ queryKey: ["recentActivity"] });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Enrollments                                                                 */
/* -------------------------------------------------------------------------- */

export function useEnrollments(filter: EnrollmentFilter = {}) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.enrollments(filter),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEnrollments(filter);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEnrollment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: EnrollmentInput) => {
      if (!actor) throw new Error("ប្រព័ន្ធមិនទាន់រួចរាល់");
      return actor.addEnrollment(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      void queryClient.invalidateQueries({ queryKey: ["student"] });
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
      void queryClient.invalidateQueries({ queryKey: ["class"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      void queryClient.invalidateQueries({ queryKey: ["recentActivity"] });
    },
  });
}

export function useRemoveEnrollment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: Id) => {
      if (!actor) throw new Error("ប្រព័ន្ធមិនទាន់រួចរាល់");
      return actor.removeEnrollment(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      void queryClient.invalidateQueries({ queryKey: ["students"] });
      void queryClient.invalidateQueries({ queryKey: ["student"] });
      void queryClient.invalidateQueries({ queryKey: ["classes"] });
      void queryClient.invalidateQueries({ queryKey: ["class"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      void queryClient.invalidateQueries({ queryKey: ["recentActivity"] });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* Dashboard                                                                   */
/* -------------------------------------------------------------------------- */

export function useDashboardStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecentActivity(limit = 8) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.recentActivity(limit),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentActivity(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

/* -------------------------------------------------------------------------- */
/* Access control                                                              */
/* -------------------------------------------------------------------------- */

export function useCallerRole() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.callerRole,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.isAdmin,
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignUserRole() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("ប្រព័ន្ធមិនទាន់រួចរាល់");
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["callerRole"] });
      void queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}
