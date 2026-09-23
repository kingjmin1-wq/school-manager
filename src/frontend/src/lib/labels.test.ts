import {
  ACTIVITY_KIND_LABELS,
  GENDER_LABELS,
  STUDENT_STATUS_LABELS,
  STUDENT_STATUS_OPTIONS,
  STUDENT_STATUS_TONES,
  USER_ROLE_LABELS,
} from "@/lib/labels";
import { ActivityKind, Gender, StudentStatus, UserRole } from "@/types";
import { describe, expect, it } from "vitest";

describe("Khmer label maps", () => {
  it("labels every gender", () => {
    expect(GENDER_LABELS[Gender.male]).toBe("ប្រុស");
    expect(GENDER_LABELS[Gender.female]).toBe("ស្រី");
    expect(GENDER_LABELS[Gender.other]).toBe("ផ្សេងៗ");
  });

  it("labels every student status", () => {
    expect(STUDENT_STATUS_LABELS[StudentStatus.active]).toBe("សកម្ម");
    expect(STUDENT_STATUS_LABELS[StudentStatus.graduated]).toBe("បានបញ្ចប់");
  });

  it("labels every user role", () => {
    expect(USER_ROLE_LABELS[UserRole.admin]).toBe("អ្នកគ្រប់គ្រង");
    expect(USER_ROLE_LABELS[UserRole.guest]).toBe("ភ្ញៀវ");
  });

  it("labels every activity kind", () => {
    for (const kind of Object.values(ActivityKind)) {
      expect(ACTIVITY_KIND_LABELS[kind]).toBeTruthy();
    }
  });

  it("assigns a tone to every student status", () => {
    for (const status of Object.values(StudentStatus)) {
      expect(STUDENT_STATUS_TONES[status]).toBeTruthy();
    }
  });

  it("exposes one option per student status", () => {
    expect(STUDENT_STATUS_OPTIONS).toHaveLength(
      Object.values(StudentStatus).length,
    );
  });
});
