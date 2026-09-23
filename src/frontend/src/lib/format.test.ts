import {
  capacityPercent,
  formatCount,
  formatIsoDate,
  formatKhmerNumber,
  formatRelativeTime,
  formatTimestamp,
  initials,
  timestampToDate,
} from "@/lib/format";
import { describe, expect, it } from "vitest";

describe("format helpers", () => {
  it("converts nanosecond timestamps to a Date", () => {
    const date = timestampToDate(1_700_000_000_000_000_000n);
    expect(date).toBeInstanceOf(Date);
    expect(date?.getTime()).toBe(1_700_000_000_000);
  });

  it("formats a timestamp as dd/mm/yyyy", () => {
    // 1_700_000_000_000 ms is 2023-11-14T22:13:20Z; the suite runs in UTC.
    expect(formatTimestamp(1_700_000_000_000_000_000n)).toBe("14/11/2023");
  });

  it("formats an ISO date string for display", () => {
    expect(formatIsoDate("2012-05-04")).toBe("04/05/2012");
  });

  it("returns a dash for an empty ISO date", () => {
    expect(formatIsoDate("")).toBe("—");
  });

  it("renders Khmer numerals", () => {
    expect(formatKhmerNumber(124n)).toBe("១២៤");
    expect(formatKhmerNumber(0)).toBe("០");
  });

  it("renders Latin counts with separators", () => {
    expect(formatCount(1234n)).toBe("1,234");
  });

  it("clamps capacity percentage to 0–100", () => {
    expect(capacityPercent(20n, 40n)).toBe(50);
    expect(capacityPercent(80n, 40n)).toBe(100);
    expect(capacityPercent(5n, 0n)).toBe(0);
  });

  it("derives two-letter initials", () => {
    expect(initials("សុខ ដារា")).toBe("សដ");
    expect(initials("Dara")).toBe("DA");
    expect(initials("   ")).toBe("?");
  });

  it("labels recent timestamps relatively", () => {
    const now = BigInt(Date.now()) * 1_000_000n;
    expect(formatRelativeTime(now)).toBe("ទើបប្រើប្រាស់");
  });
});
