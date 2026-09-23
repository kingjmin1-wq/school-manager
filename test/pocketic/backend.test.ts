/**
 * PocketIC backend lane: drives the app's real compiled canister.
 *
 * The frontend suite mocks the actor, so it passes unchanged against a backend
 * whose public methods are unimplemented stubs. This file installs the real
 * `src/backend/dist/backend.wasm` into the platform's PocketIC replica and
 * calls the public API, which is the only thing that can catch a canister that
 * traps on its own interface.
 *
 * Shapes come from the generated agent-js declarations, not the TypeScript
 * wrapper: `?T` is `[] | [T]`, `Nat` is `bigint`, and a variant is
 * `{ variantName: null }`.
 */

import { createIdentity, PocketIc } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

const admin = createIdentity("school-admin");
const teacher = createIdentity("school-teacher");

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
    sender: admin.getPrincipal(),
  }));
  // The first caller to initialize becomes the admin; every later caller is a
  // default user. Reads require a registered caller, so this runs first.
  actor.setIdentity(admin);
  await actor._initialize_access_control();
});

afterAll(async () => {
  await pic?.tearDown();
});

it("answers every read instead of trapping", async () => {
  actor.setIdentity(admin);
  // The canister seeds sample data on first start, so these are not empty; the
  // point is that each public read resolves rather than trapping.
  await expect(actor.listStudents({ search: [], classId: [], status: [] })).resolves.toBeInstanceOf(Array);
  await expect(actor.listTeachers({ search: [] })).resolves.toBeInstanceOf(Array);
  await expect(actor.listClasses({ search: [], homeroomTeacherId: [] })).resolves.toBeInstanceOf(Array);
  await expect(actor.listEnrollments({ studentId: [], classId: [] })).resolves.toBeInstanceOf(Array);
  await expect(actor.getRecentActivity(5n)).resolves.toBeInstanceOf(Array);
  await expect(actor.getDashboardStats()).resolves.toMatchObject({
    studentCount: expect.any(BigInt),
    teacherCount: expect.any(BigInt),
    classCount: expect.any(BigInt),
    enrollmentCount: expect.any(BigInt),
  });
});

it("round-trips a student through the real canister", async () => {
  actor.setIdentity(admin);
  const created = await actor.createStudent({
    name: "សុខ ដារា",
    gender: { male: null },
    dateOfBirth: "2012-05-04",
    guardianName: "សុខ វិចិត្រ",
    guardianPhone: "012 345 678",
    status: { active: null },
  });
  expect(created.name).toBe("សុខ ដារា");

  const students = await actor.listStudents({ search: [], classId: [], status: [] });
  expect(students).toContainEqual(expect.objectContaining({ id: created.id, name: "សុខ ដារា" }));

  const fetched = await actor.getStudent(created.id);
  expect(fetched).toHaveLength(1);
  expect(fetched[0]?.name).toBe("សុខ ដារា");
});

it("enrolls a student into a class and reports it on the dashboard", async () => {
  actor.setIdentity(admin);
  const classRecord = await actor.createClass({
    name: "១២A វិទ្យាសាស្ត្រ",
    gradeLevel: "ថ្នាក់ទី ១២",
    capacity: 40n,
    homeroomTeacherId: [],
  });
  const student = await actor.createStudent({
    name: "ចន សុភា",
    gender: { female: null },
    dateOfBirth: "2012-06-01",
    guardianName: "ចន វិបុល",
    guardianPhone: "098 765 432",
    status: { active: null },
  });

  const enrollment = await actor.addEnrollment({
    studentId: student.id,
    classId: classRecord.id,
  });
  expect(enrollment.studentId).toBe(student.id);
  expect(enrollment.classId).toBe(classRecord.id);

  const stats = await actor.getDashboardStats();
  expect(stats.studentCount).toBeGreaterThanOrEqual(1n);
  expect(stats.classCount).toBeGreaterThanOrEqual(1n);
  expect(stats.enrollmentCount).toBeGreaterThanOrEqual(1n);
});

it("rejects a non-admin caller from mutating data", async () => {
  actor.setIdentity(teacher);
  await actor._initialize_access_control();
  await expect(
    actor.createStudent({
      name: "មិនអនុញ្ញាត",
      gender: { other: null },
      dateOfBirth: "2013-01-01",
      guardianName: "—",
      guardianPhone: "000",
      status: { active: null },
    }),
  ).rejects.toThrow();
});

it("does not expose admin-only mutations to an anonymous caller", async () => {
  const guest = pic!.createActor<_SERVICE>(idlFactory, canisterId);
  await expect(
    guest.createTeacher({
      name: "មិនអនុញ្ញាត",
      subject: "—",
      email: "—",
      phone: "—",
    }),
  ).rejects.toThrow();
});
