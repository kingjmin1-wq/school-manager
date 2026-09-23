/**
 * Khmer display labels for backend enums and shared UI vocabulary.
 *
 * Backend enums are value exports from `@/backend`; these maps keep the Khmer
 * copy in one place so every page renders the same wording.
 */

import { ActivityKind, Gender, StudentStatus, UserRole } from "@/backend";

export const GENDER_LABELS: Record<Gender, string> = {
  [Gender.male]: "ប្រុស",
  [Gender.female]: "ស្រី",
  [Gender.other]: "ផ្សេងៗ",
};

export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
  [StudentStatus.active]: "សកម្ម",
  [StudentStatus.inactive]: "អសកម្ម",
  [StudentStatus.graduated]: "បានបញ្ចប់",
  [StudentStatus.transferred]: "បានផ្ទេរ",
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.admin]: "អ្នកគ្រប់គ្រង",
  [UserRole.user]: "អ្នកប្រើប្រាស់",
  [UserRole.guest]: "ភ្ញៀវ",
};

export const ACTIVITY_KIND_LABELS: Record<ActivityKind, string> = {
  [ActivityKind.studentCreated]: "បន្ថែមសិស្ស",
  [ActivityKind.studentUpdated]: "កែប្រែសិស្ស",
  [ActivityKind.studentDeleted]: "លុបសិស្ស",
  [ActivityKind.teacherCreated]: "បន្ថែមគ្រូ",
  [ActivityKind.teacherUpdated]: "កែប្រែគ្រូ",
  [ActivityKind.teacherDeleted]: "លុបគ្រូ",
  [ActivityKind.classCreated]: "បន្ថែមថ្នាក់រៀន",
  [ActivityKind.classUpdated]: "កែប្រែថ្នាក់រៀន",
  [ActivityKind.classDeleted]: "លុបថ្នាក់រៀន",
  [ActivityKind.enrollmentAdded]: "ចុះឈ្មោះចូលថ្នាក់",
  [ActivityKind.enrollmentRemoved]: "ដកចេញពីថ្នាក់",
};

/** Tone used by status badges, mapped to semantic token variants. */
export type StatusTone = "success" | "warning" | "muted" | "destructive";

export const STUDENT_STATUS_TONES: Record<StudentStatus, StatusTone> = {
  [StudentStatus.active]: "success",
  [StudentStatus.inactive]: "muted",
  [StudentStatus.graduated]: "warning",
  [StudentStatus.transferred]: "destructive",
};

export const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  { value: Gender.male, label: GENDER_LABELS[Gender.male] },
  { value: Gender.female, label: GENDER_LABELS[Gender.female] },
  { value: Gender.other, label: GENDER_LABELS[Gender.other] },
];

export const STUDENT_STATUS_OPTIONS: Array<{
  value: StudentStatus;
  label: string;
}> = [
  {
    value: StudentStatus.active,
    label: STUDENT_STATUS_LABELS[StudentStatus.active],
  },
  {
    value: StudentStatus.inactive,
    label: STUDENT_STATUS_LABELS[StudentStatus.inactive],
  },
  {
    value: StudentStatus.graduated,
    label: STUDENT_STATUS_LABELS[StudentStatus.graduated],
  },
  {
    value: StudentStatus.transferred,
    label: STUDENT_STATUS_LABELS[StudentStatus.transferred],
  },
];
