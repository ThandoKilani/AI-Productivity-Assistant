import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Sparkles, X, Bell } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { navItems } from "./nav-items";
import { cn } from "@/lib/utils";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1">
      {navItems.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lift"
                : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-[18px] shrink-0" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-xl bg-brand text-sidebar-primary-foreground shadow-lift">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-sidebar-foreground">
          AI Workplace
        </span>
        <span className="block truncate text-xs text-sidebar-muted">Productivity Assistant</span>
      </span>
    </div>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar p-4">
      <div className="px-1 pt-1">
        <Brand />
      </div>
      <div className="flex-1 overflow-y-auto">
        <NavList onNavigate={onNavigate} />
      </div>
      <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3">
        <p className="text-xs font-medium text-sidebar-foreground">Review before you rely on it</p>
        <p className="mt-1 text-xs leading-relaxed text-sidebar-muted">
          AI output can contain errors. Always check important content yourself.
        </p>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-sidebar-border p-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
          NK
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-sidebar-foreground">
            Ntombothando K.
          </span>
          <span className="block truncate text-xs text-sidebar-muted">Operations Lead</span>
        </span>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-screen">
        <SidebarInner />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />
          <div className="relative h-full w-[17rem] max-w-[85vw] animate-in slide-in-from-left duration-200">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -right-11 top-3 grid size-9 place-items-center rounded-lg bg-surface text-foreground shadow-card"
              aria-label="Close navigation"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
            <SidebarInner onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-xl border border-border text-foreground transition-colors hover:bg-secondary lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                AI Workplace Productivity Assistant
              </p>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                Work smarter. Plan better. Communicate faster.
              </p>
            </div>
            <button
              type="button"
              className="hidden size-10 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:grid"
              aria-label="Notifications"
            >
              <Bell className="size-[18px]" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-border py-1.5 pl-1.5 pr-3">
              <span className="grid size-8 place-items-center rounded-full bg-brand text-xs font-semibold text-primary-foreground">
                NK
              </span>
              <span className="hidden text-xs font-medium sm:block">Ntombothando K.</span>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>

        <footer className="border-t border-border px-4 py-4 text-xs text-muted-foreground sm:px-6">
          AI-generated content may be inaccurate or incomplete — please review before you use it.
        </footer>
      </div>
    </div>
  );
}
