/**
 * Application shell: fixed tinted sidebar rail, sticky header, mobile drawer,
 * and attribution footer. Pages render inside the `bg-background` content area.
 */

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAdminAccess, useAuth } from "@/hooks/useAuth";
import { initials } from "@/lib/format";
import {
  APP_NAME,
  APP_SUBTITLE,
  NAV_ITEMS,
  type NavItem,
  pageTitleFor,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { type ReactNode, useState } from "react";

const FOOTER_HREF = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
  typeof window === "undefined" ? "" : window.location.hostname,
)}`;

function isActivePath(pathname: string, to: string): boolean {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isActivePath(pathname, item.to);
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      data-ocid={`nav.${item.to === "/" ? "dashboard" : item.to.slice(1)}.link`}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-smooth",
        active
          ? "rail-active animate-rail-in bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0",
          active ? "text-accent" : "text-muted-foreground",
        )}
        aria-hidden="true"
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function SidebarRail({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const { isAdmin } = useAdminAccess();
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <BookOpen className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-sm font-bold tracking-tight text-sidebar-foreground">
            {APP_NAME}
          </span>
          <span className="block truncate text-[11px] text-muted-foreground">
            {APP_SUBTITLE}
          </span>
        </span>
      </div>

      <nav
        aria-label="ម៉ឺនុយមេ"
        data-ocid="nav.sidebar"
        className="flex flex-1 flex-col gap-1 overflow-y-auto p-3"
      >
        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          ទិន្នន័យសាលា
        </p>
        {items.map((item) => (
          <NavLink
            key={item.to}
            item={item}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
          ឆ្នាំសិក្សា ២០២៥–២០២៦
        </p>
      </div>
    </div>
  );
}

function AccountMenu() {
  const { isAuthenticated, principalText, login, logout, isLoggingIn } =
    useAuth();
  const { isAdmin } = useAdminAccess();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = search.trim();
    if (!term) return;
    void navigate({ to: "/students", search: { q: term } });
  };

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={handleSearch} className="relative hidden md:block">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ស្វែងរកសិស្ស គ្រូ ឬថ្នាក់រៀន…"
          aria-label="ស្វែងរក"
          data-ocid="header.search_input"
          className="h-9 w-56 rounded-md pl-8 lg:w-72"
        />
      </form>

      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="ម៉ឺនុយគណនី"
              data-ocid="header.account_button"
              className="rounded-full"
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                  {initials(principalText ?? "អ")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <UserRound className="size-3.5" aria-hidden="true" />
                គណនីរបស់អ្នក
              </span>
              <span className="truncate font-mono text-[11px] font-normal text-muted-foreground">
                {principalText}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="gap-2">
              <ShieldCheck className="size-4" aria-hidden="true" />
              {isAdmin ? "អ្នកគ្រប់គ្រង" : "អ្នកប្រើប្រាស់ធម្មតា"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => logout()}
              data-ocid="header.logout_button"
              className="gap-2"
            >
              <LogOut className="size-4" aria-hidden="true" />
              ចាកចេញ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          type="button"
          size="sm"
          onClick={() => login()}
          disabled={isLoggingIn}
          data-ocid="header.login_button"
          className="rounded-md"
        >
          <LogIn className="size-4" aria-hidden="true" />
          {isLoggingIn ? "កំពុងចូល…" : "ចូលប្រើប្រាស់"}
        </Button>
      )}
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const title = pageTitleFor(pathname);

  return (
    <div className="flex min-h-screen bg-background">
      {!isMobile && (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border md:block">
          <SidebarRail pathname={pathname} />
        </aside>
      )}

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="left"
          className="w-72 border-sidebar-border bg-sidebar p-0"
          data-ocid="nav.sheet"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>ម៉ឺនុយមេ</SheetTitle>
          </SheetHeader>
          <SidebarRail
            pathname={pathname}
            onNavigate={() => setDrawerOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card px-4 md:px-6">
          {isMobile && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="បើកម៉ឺនុយ"
              data-ocid="nav.open_button"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-base font-bold tracking-tight md:text-lg">
              {title}
            </h1>
          </div>
          <AccountMenu />
        </header>

        <main
          data-ocid="page.content"
          className="flex-1 px-4 py-4 md:px-6 md:py-6 lg:px-8"
        >
          {children}
        </main>

        <footer className="hidden border-t border-border bg-muted/40 px-6 py-3 md:block">
          <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>{APP_NAME} · ឆ្នាំសិក្សា ២០២៥–២០២៦</span>
            <a
              href={FOOTER_HREF}
              target="_blank"
              rel="noreferrer"
              className="transition-smooth hover:text-foreground"
            >
              © {new Date().getFullYear()}. Built with love using caffeine.ai
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
