import { pageTitleFor } from "@/lib/navigation";
import { describe, expect, it } from "vitest";

describe("pageTitleFor", () => {
  it("maps the dashboard root", () => {
    expect(pageTitleFor("/")).toBe("ផ្ទាំងគ្រប់គ្រង");
  });

  it("maps list routes by prefix", () => {
    expect(pageTitleFor("/students")).toBe("សិស្ស");
    expect(pageTitleFor("/teachers")).toBe("គ្រូបង្រៀន");
    expect(pageTitleFor("/classes")).toBe("ថ្នាក់រៀន");
    expect(pageTitleFor("/settings")).toBe("ការកំណត់ប្រព័ន្ធ");
  });

  it("maps nested detail routes to their section title", () => {
    expect(pageTitleFor("/students/12")).toBe("សិស្ស");
    expect(pageTitleFor("/classes/3")).toBe("ថ្នាក់រៀន");
  });

  it("falls back to the dashboard title for unknown paths", () => {
    expect(pageTitleFor("/nope")).toBe("ផ្ទាំងគ្រប់គ្រង");
  });
});
