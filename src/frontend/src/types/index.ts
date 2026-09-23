/**
 * Shared type re-exports for the school register.
 *
 * Enums are re-exported as values (they are used in `switch` statements and
 * label maps); interfaces and aliases are re-exported as types.
 */

export type {
  ActivityEntry,
  Class,
  ClassDistribution,
  ClassFilter,
  ClassInput,
  ClassUpdate,
  DashboardStats,
  Enrollment,
  EnrollmentFilter,
  EnrollmentInput,
  Id,
  Student,
  StudentFilter,
  StudentInput,
  StudentUpdate,
  Teacher,
  TeacherFilter,
  TeacherInput,
  TeacherUpdate,
  Timestamp,
} from "@/backend";

export { ActivityKind, Gender, StudentStatus, UserRole } from "@/backend";
