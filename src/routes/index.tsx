import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  FileText,
  Mail,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  AiNotice,
  PageHeader,
  Pill,
  SectionCard,
} from "@/components/ui-kit";
import { priorityStyles, recentActivity, stats, todaysPriorities } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Work smarter, plan better and communicate faster with an AI assistant for emails, meeting notes, task planning and research.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Work smarter. Plan better. Communicate faster.",
      },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  {
    to: "/smart-email" as const,
    title: "Generate an Email",
    description: "Draft a clear, on-tone message from a few key points.",
    icon: Mail,
  },
  {
    to: "/meeting-notes" as const,
    title: "Summarize Meeting",
    description: "Turn raw notes into decisions and action items.",
    icon: FileText,
  },
  {
    to: "/task-planner" as const,
    title: "Plan My Day",
    description: "Fit your task list into your working hours.",
    icon: CalendarClock,
  },
  {
    to: "/research" as const,
    title: "Research a Topic",
    description: "Build a structured brief with insights and risks.",
    icon: BookOpen,
  },
  {
    to: "/chat" as const,
    title: "Ask AI Assistant",
    description: "Talk through anything on your plate right now.",
    icon: MessagesSquare,
  },
];

const statTones = {
  primary: "bg-primary/10 text-primary",
  violet: "bg-violet/10 text-violet",
  success: "bg-success/12 text-success",
  warning: "bg-warning/18 text-warning-foreground",
};

function Dashboard() {
  return (
    <AppShell>
      <PageHeader
        title="Good morning 👋"
        subtitle="Your AI-powered workplace productivity assistant."
        actions={<Pill tone="primary">Wednesday, 9 September</Pill>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="min-w-0 rounded-2xl border border-border bg-card p-5 shadow-card transition-shadow duration-200 hover:shadow-lift"
          >
            <p className="truncate text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
            <span
              className={cn(
                "mt-3 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                statTones[stat.tone],
              )}
            >
              {stat.delta}
            </span>
          </div>
        ))}
      </div>

      <h2 className="mt-10 mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {quickActions.map(({ to, title, description, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group flex min-w-0 flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-brand text-primary-foreground">
              <Icon className="size-[18px]" aria-hidden="true" />
            </span>
            <span className="mt-4 text-sm font-semibold text-foreground">{title}</span>
            <span className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {description}
            </span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
              Open tool
              <ArrowRight
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SectionCard title="Recent Activity" description="Your last few AI sessions.">
          <ul className="divide-y divide-border">
            {recentActivity.map((item) => (
              <li key={item.title} className="flex min-w-0 gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Pill tone="violet">{item.kind}</Pill>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Today's Priorities" description="Demo workload for this workspace.">
          <ul className="space-y-3">
            {todaysPriorities.map((item) => (
              <li
                key={item.task}
                className="min-w-0 rounded-xl border border-border bg-secondary/40 p-3.5"
              >
                <p className="text-sm font-medium break-words text-foreground">{item.task}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 font-medium",
                      priorityStyles[item.priority],
                    )}
                  >
                    {item.priority}
                  </span>
                  <span>Due {item.due}</span>
                  <span aria-hidden="true">•</span>
                  <span>{item.duration}</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="mt-8 space-y-3">
        <AiNotice />
        <Link
          to="/responsible-ai"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Read our Responsible AI guidance
        </Link>
      </div>
    </AppShell>
  );
}
