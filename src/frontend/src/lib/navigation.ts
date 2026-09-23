/**
 * Shared navigation model for the sidebar rail and mobile drawer.
 *
 * `adminOnly` entries are hidden from read-only users; the matching routes are
 * still guarded in `App.tsx`.
 */

import {
  GraduationCap,
  LayoutDashboard,
  School,
  Settings,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "ផ្ទាំងគ្រប់គ្រង", icon: LayoutDashboard },
  { to: "/students", label: "សិស្ស", icon: GraduationCap },
  { to: "/teachers", label: "គ្រូបង្រៀន", icon: Users },
  { to: "/classes", label: "ថ្នាក់រៀន", icon: School },
  { to: "/settings", label: "ការកំណត់", icon: Settings, adminOnly: true },
];

/** Page titles keyed by route prefix, used by the sticky header. */
export const PAGE_TITLES: Array<{ prefix: string; title: string }> = [
  { prefix: "/students", title: "សិស្ស" },
  { prefix: "/teachers", title: "គ្រូបង្រៀន" },
  { prefix: "/classes", title: "ថ្នាក់រៀន" },
  { prefix: "/settings", title: "ការកំណត់ប្រព័ន្ធ" },
  { prefix: "/", title: "ផ្ទាំងគ្រប់គ្រង" },
];

export function pageTitleFor(pathname: string): string {
  const match = PAGE_TITLES.find(
    (entry) => entry.prefix !== "/" && pathname.startsWith(entry.prefix),
  );
  return match?.title ?? "ផ្ទាំងគ្រប់គ្រង";
}

export const APP_NAME = "បញ្ជីឈ្មោះសាលារៀន";
export const APP_SUBTITLE = "ប្រព័ន្ធគ្រប់គ្រងសិស្ស គ្រូ និងថ្នាក់រៀន";
