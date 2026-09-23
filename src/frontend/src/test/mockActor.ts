import type {
  ActivityEntry,
  Class,
  ClassDistribution,
  DashboardStats,
  Enrollment,
  Student,
  Teacher,
} from "@/types";
import { ActivityKind, Gender, StudentStatus, UserRole } from "@/types";
import { vi } from "vitest";

/**
 * Typed local actor mock for the generated `Backend` seam.
 *
 * The app reaches the backend exclusively through `useActor(createActor)` and
 * the `backendInterface` methods, so tests inject this object instead of a
 * real canister. Every method is a `vi.fn` so individual tests can assert on
 * calls or override a single response without touching the rest.
 */

export type MockActor = {
  [K in keyof BackendMethods]: ReturnType<typeof vi.fn>;
};

type BackendMethods = {
  listStudents: (filter: unknown) => Promise<Student[]>;
  getStudent: (id: bigint) => Promise<Student | null>;
  createStudent: (input: unknown) => Promise<Student>;
  updateStudent: (id: bigint, update: unknown) => Promise<Student | null>;
  deleteStudent: (id: bigint) => Promise<boolean>;
  listTeachers: (filter: unknown) => Promise<Teacher[]>;
  getTeacher: (id: bigint) => Promise<Teacher | null>;
  createTeacher: (input: unknown) => Promise<Teacher>;
  updateTeacher: (id: bigint, update: unknown) => Promise<Teacher | null>;
  deleteTeacher: (id: bigint) => Promise<boolean>;
  listClasses: (filter: unknown) => Promise<Class[]>;
  getClass: (id: bigint) => Promise<Class | null>;
  createClass: (input: unknown) => Promise<Class>;
  updateClass: (id: bigint, update: unknown) => Promise<Class | null>;
  deleteClass: (id: bigint) => Promise<boolean>;
  listEnrollments: (filter: unknown) => Promise<Enrollment[]>;
  addEnrollment: (input: unknown) => Promise<Enrollment>;
  removeEnrollment: (id: bigint) => Promise<boolean>;
  getDashboardStats: () => Promise<DashboardStats>;
  getRecentActivity: (limit: bigint) => Promise<ActivityEntry[]>;
  getCallerUserRole: () => Promise<UserRole>;
  isCallerAdmin: () => Promise<boolean>;
  assignCallerUserRole: (user: unknown, role: UserRole) => Promise<void>;
};

export const TS = 1_700_000_000_000_000_000n;

export function makeStudent(overrides: Partial<Student> = {}): Student {
  return {
    id: 1n,
    name: "សុខ ដារា",
    gender: Gender.male,
    dateOfBirth: "2012-05-04",
    guardianName: "សុខ វិចិត្រ",
    guardianPhone: "012 345 678",
    status: StudentStatus.active,
    classIds: [],
    createdAt: TS,
    updatedAt: TS,
    ...overrides,
  };
}

export function makeTeacher(overrides: Partial<Teacher> = {}): Teacher {
  return {
    id: 1n,
    name: "ចន្ថា សុភា",
    subject: "គណិតវិទ្យា",
    email: "sopha@school.edu.kh",
    phone: "011 222 333",
    createdAt: TS,
    updatedAt: TS,
    ...overrides,
  };
}

export function makeClass(overrides: Partial<Class> = {}): Class {
  return {
    id: 1n,
    name: "១២A វិទ្យាសាស្ត្រ",
    gradeLevel: "ថ្នាក់ទី ១២",
    capacity: 40n,
    enrolledCount: 0n,
    createdAt: TS,
    updatedAt: TS,
    ...overrides,
  };
}

export function makeEnrollment(
  overrides: Partial<Enrollment> = {},
): Enrollment {
  return {
    id: 1n,
    studentId: 1n,
    classId: 1n,
    enrolledAt: TS,
    ...overrides,
  };
}

export function makeStats(
  overrides: Partial<DashboardStats> = {},
): DashboardStats {
  return {
    studentCount: 0n,
    teacherCount: 0n,
    classCount: 0n,
    enrollmentCount: 0n,
    studentsPerClass: [],
    ...overrides,
  };
}

export function makeDistribution(
  overrides: Partial<ClassDistribution> = {},
): ClassDistribution {
  return {
    classId: 1n,
    className: "១២A វិទ្យាសាស្ត្រ",
    studentCount: 0n,
    ...overrides,
  };
}

export function makeActivity(
  overrides: Partial<ActivityEntry> = {},
): ActivityEntry {
  return {
    id: 1n,
    kind: ActivityKind.studentCreated,
    message: "បានបន្ថែមសិស្ស សុខ ដារា",
    at: TS,
    performedBy: { toText: () => "aaaaa-aa" } as ActivityEntry["performedBy"],
    ...overrides,
  };
}

export type MockActorOptions = {
  students?: Student[];
  teachers?: Teacher[];
  classes?: Class[];
  enrollments?: Enrollment[];
  stats?: DashboardStats;
  activity?: ActivityEntry[];
  isAdmin?: boolean;
  callerRole?: UserRole;
};

/**
 * Build a fully-stubbed actor. Defaults are empty collections and a
 * non-admin caller, so a test only states the data it cares about.
 */
export function createMockActor(options: MockActorOptions = {}): MockActor {
  const {
    students = [],
    teachers = [],
    classes = [],
    enrollments = [],
    stats = makeStats(),
    activity = [],
    isAdmin = false,
    callerRole = isAdmin ? UserRole.admin : UserRole.user,
  } = options;

  return {
    listStudents: vi.fn(async () => students),
    getStudent: vi.fn(async (id: bigint) => {
      return students.find((s) => s.id === id) ?? null;
    }),
    createStudent: vi.fn(async () => makeStudent()),
    updateStudent: vi.fn(async () => makeStudent()),
    deleteStudent: vi.fn(async () => true),
    listTeachers: vi.fn(async () => teachers),
    getTeacher: vi.fn(async (id: bigint) => {
      return teachers.find((t) => t.id === id) ?? null;
    }),
    createTeacher: vi.fn(async () => makeTeacher()),
    updateTeacher: vi.fn(async () => makeTeacher()),
    deleteTeacher: vi.fn(async () => true),
    listClasses: vi.fn(async () => classes),
    getClass: vi.fn(async (id: bigint) => {
      return classes.find((c) => c.id === id) ?? null;
    }),
    createClass: vi.fn(async () => makeClass()),
    updateClass: vi.fn(async () => makeClass()),
    deleteClass: vi.fn(async () => true),
    listEnrollments: vi.fn(async () => enrollments),
    addEnrollment: vi.fn(async () => makeEnrollment()),
    removeEnrollment: vi.fn(async () => true),
    getDashboardStats: vi.fn(async () => stats),
    getRecentActivity: vi.fn(async () => activity),
    getCallerUserRole: vi.fn(async () => callerRole),
    isCallerAdmin: vi.fn(async () => isAdmin),
    assignCallerUserRole: vi.fn(async () => undefined),
  };
}
