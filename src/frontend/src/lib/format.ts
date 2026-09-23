/**
 * Shared formatting helpers for the school register.
 *
 * Backend timestamps are Motoko `Time.now()` nanosecond bigints and must never
 * reach a JavaScript `Date` without going through `timestampToDate`.
 */

const KHMER_DIGITS = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];

/** Convert a backend nanosecond timestamp into a `Date`, or `null` if invalid. */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Format a backend timestamp as `dd/mm/yyyy`, or a dash when unavailable. */
export function formatTimestamp(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

/** Format an ISO `yyyy-mm-dd` date string (as stored by the backend) for display. */
export function formatIsoDate(value: string): string {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

/** Relative "time ago" label in Khmer for recent-activity rows. */
export function formatRelativeTime(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "ទើបប្រើប្រាស់";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} នាទីមុន`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ម៉ោងមុន`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ថ្ងៃមុន`;
  return formatTimestamp(timestamp);
}

/** Render a bigint count with Khmer numerals, e.g. `១២៤`. */
export function formatKhmerNumber(value: bigint | number): string {
  return String(value).replace(/\d/g, (digit) => KHMER_DIGITS[Number(digit)]);
}

/** Render a bigint count with Latin digits and thousands separators. */
export function formatCount(value: bigint | number): string {
  return Number(value).toLocaleString("en-US");
}

/** Percentage of a class capacity that is filled, clamped to 0–100. */
export function capacityPercent(enrolled: bigint, capacity: bigint): number {
  if (capacity <= 0n) return 0;
  const ratio = Number((enrolled * 100n) / capacity);
  return Math.max(0, Math.min(100, ratio));
}

/** Two-letter initials for an avatar fallback. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
