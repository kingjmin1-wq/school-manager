import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ActivityEntry {
    at: Timestamp;
    id: Id;
    kind: ActivityKind;
    message: string;
    performedBy: Principal;
}
export interface Cell {
    value: Value;
    name: string;
}
export interface Class {
    id: Id;
    name: string;
    createdAt: Timestamp;
    homeroomTeacherId?: Id;
    updatedAt: Timestamp;
    gradeLevel: string;
    capacity: bigint;
    enrolledCount: bigint;
}
export interface ClassDistribution {
    classId: Id;
    className: string;
    studentCount: bigint;
}
export interface ClassFilter {
    search?: string;
    homeroomTeacherId?: Id;
}
export interface ClassInput {
    name: string;
    homeroomTeacherId?: Id;
    gradeLevel: string;
    capacity: bigint;
}
export interface ClassUpdate {
    name?: string;
    homeroomTeacherId?: Id;
    gradeLevel?: string;
    capacity?: bigint;
}
export interface DashboardStats {
    studentsPerClass: Array<ClassDistribution>;
    teacherCount: bigint;
    classCount: bigint;
    studentCount: bigint;
    enrollmentCount: bigint;
}
export interface Enrollment {
    id: Id;
    studentId: Id;
    classId: Id;
    enrolledAt: Timestamp;
}
export interface EnrollmentFilter {
    studentId?: Id;
    classId?: Id;
}
export interface EnrollmentInput {
    studentId: Id;
    classId: Id;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export type Id = bigint;
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Student {
    id: Id;
    status: StudentStatus;
    dateOfBirth: string;
    name: string;
    createdAt: Timestamp;
    guardianPhone: string;
    updatedAt: Timestamp;
    gender: Gender;
    guardianName: string;
    classIds: Array<Id>;
}
export interface StudentFilter {
    status?: StudentStatus;
    search?: string;
    classId?: Id;
}
export interface StudentInput {
    status: StudentStatus;
    dateOfBirth: string;
    name: string;
    guardianPhone: string;
    gender: Gender;
    guardianName: string;
}
export interface StudentUpdate {
    status?: StudentStatus;
    dateOfBirth?: string;
    name?: string;
    guardianPhone?: string;
    gender?: Gender;
    guardianName?: string;
}
export interface Teacher {
    id: Id;
    subject: string;
    name: string;
    createdAt: Timestamp;
    email: string;
    updatedAt: Timestamp;
    phone: string;
}
export interface TeacherFilter {
    search?: string;
}
export interface TeacherInput {
    subject: string;
    name: string;
    email: string;
    phone: string;
}
export interface TeacherUpdate {
    subject?: string;
    name?: string;
    email?: string;
    phone?: string;
}
export type Timestamp = bigint;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum ActivityKind {
    teacherCreated = "teacherCreated",
    teacherDeleted = "teacherDeleted",
    enrollmentRemoved = "enrollmentRemoved",
    studentUpdated = "studentUpdated",
    classUpdated = "classUpdated",
    teacherUpdated = "teacherUpdated",
    studentCreated = "studentCreated",
    studentDeleted = "studentDeleted",
    enrollmentAdded = "enrollmentAdded",
    classCreated = "classCreated",
    classDeleted = "classDeleted"
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male"
}
export enum StudentStatus {
    active = "active",
    inactive = "inactive",
    transferred = "transferred",
    graduated = "graduated"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    /**
     * / Enroll a student into a class. Admin only.
     */
    addEnrollment(input: EnrollmentInput): Promise<Enrollment>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Create a class. Admin only.
     */
    createClass(input: ClassInput): Promise<Class>;
    /**
     * / Create a student. Admin only.
     */
    createStudent(input: StudentInput): Promise<Student>;
    /**
     * / Create a teacher. Admin only.
     */
    createTeacher(input: TeacherInput): Promise<Teacher>;
    /**
     * / Delete a class. Admin only.
     */
    deleteClass(id: Id): Promise<boolean>;
    /**
     * / Delete a student. Admin only.
     */
    deleteStudent(id: Id): Promise<boolean>;
    /**
     * / Delete a teacher. Admin only.
     */
    deleteTeacher(id: Id): Promise<boolean>;
    execute(qJson: string): Promise<Result>;
    /**
     * / Return the backend API documentation as Markdown.
     */
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Fetch a single class by id.
     */
    getClass(id: Id): Promise<Class | null>;
    /**
     * / Aggregate counts for the dashboard.
     */
    getDashboardStats(): Promise<DashboardStats>;
    /**
     * / Most recent activity entries, newest first.
     */
    getRecentActivity(limit: bigint): Promise<Array<ActivityEntry>>;
    /**
     * / Fetch a single student by id.
     */
    getStudent(id: Id): Promise<Student | null>;
    /**
     * / Fetch a single teacher by id.
     */
    getTeacher(id: Id): Promise<Teacher | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / List classes, optionally filtered by search text or homeroom teacher.
     */
    listClasses(filter: ClassFilter): Promise<Array<Class>>;
    /**
     * / List enrollments, optionally filtered by student or class.
     */
    listEnrollments(filter: EnrollmentFilter): Promise<Array<Enrollment>>;
    /**
     * / List students, optionally filtered by search text, class, or status.
     */
    listStudents(filter: StudentFilter): Promise<Array<Student>>;
    /**
     * / List teachers, optionally filtered by search text.
     */
    listTeachers(filter: TeacherFilter): Promise<Array<Teacher>>;
    /**
     * / Remove an enrollment. Admin only.
     */
    removeEnrollment(id: Id): Promise<boolean>;
    schema(): Promise<string>;
    /**
     * / Update a class, including homeroom teacher and capacity. Admin only.
     */
    updateClass(id: Id, update: ClassUpdate): Promise<Class | null>;
    /**
     * / Update a student. Admin only.
     */
    updateStudent(id: Id, update: StudentUpdate): Promise<Student | null>;
    /**
     * / Update a teacher. Admin only.
     */
    updateTeacher(id: Id, update: TeacherUpdate): Promise<Teacher | null>;
}
