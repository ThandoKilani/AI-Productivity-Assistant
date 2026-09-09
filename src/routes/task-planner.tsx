import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarClock, Clock, Flag, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import {
  ActionButton,
  AiNotice,
  BulletList,
  CopyButton,
  EmptyState,
  ErrorState,
  Field,
  LoadingState,
  PageHeader,
  SectionCard,
  SelectInput,
  SourceBadge,
  TextArea,
  TextInput,
} from "@/components/ui-kit";
import { planSchedule } from "@/lib/ai.functions";
import type { AiSource, SchedulePlan } from "@/lib/ai-types";
import { priorityStyles, sampleTaskList } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn a task list with deadlines, priorities and durations into a realistic schedule inside your working hours.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "A realistic day plan built from your deadlines, priorities and available hours.",
      },
    ],
  }),
  component: TaskPlanner,
});

const DEMO_PLAN: SchedulePlan = {
  schedule: [
    {
      startTime: "08:30",
      endTime: "09:00",
      task: "Send Meridian Logistics contract renewal email",
      priority: "Critical",
      duration: "30 min",
      deadline: "Today 11:00",
    },
    {
      startTime: "09:00",
      endTime: "10:30",
      task: "Finalise onboarding portal launch checklist",
      priority: "High",
      duration: "90 min",
      deadline: "Today 15:00",
    },
    {
      startTime: "10:45",
      endTime: "12:45",
      task: "Prepare Q3 budget review slides",
      priority: "High",
      duration: "120 min",
      deadline: "Friday",
    },
    {
      startTime: "13:30",
      endTime: "14:00",
      task: "Review supplier invoices for August",
      priority: "Medium",
      duration: "45 min",
      deadline: "Tomorrow 12:00",
    },
    {
      startTime: "14:00",
      endTime: "14:30",
      task: "1:1 with Sipho about SSO testing",
      priority: "Medium",
      duration: "30 min",
      deadline: "Fixed at 14:00 today",
    },
    {
      startTime: "14:30",
      endTime: "14:55",
      task: "Update team wiki with new leave process",
      priority: "Low",
      duration: "25 min",
      deadline: "Not specified",
    },
  ],
  priorityOverview: {
    critical: ["Send Meridian Logistics contract renewal email"],
    high: ["Finalise onboarding portal launch checklist", "Prepare Q3 budget review slides"],
    medium: ["Review supplier invoices for August", "1:1 with Sipho about SSO testing"],
    low: ["Update team wiki with new leave process"],
  },
  capacityWarning: null,
  notes: [
    "Invoice review was shortened to 45 minutes to protect the fixed 14:00 meeting.",
    "A 15-minute break is left after the morning block.",
  ],
};

const PRIORITIES = ["Critical", "High", "Medium", "Low"] as const;

function TaskPlanner() {
  const run = useServerFn(planSchedule);

  const [tasks, setTasks] = useState(sampleTaskList);
  const [workingHours, setWorkingHours] = useState("08:30 – 16:30, one hour lunch at 12:45");
  const [preferences, setPreferences] = useState(
    "Deep focus work in the morning. Keep the 14:00 meeting fixed.",
  );
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newPriority, setNewPriority] = useState<(typeof PRIORITIES)[number]>("Medium");
  const [newDuration, setNewDuration] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<AiSource | null>(null);
  const [plan, setPlan] = useState<SchedulePlan | null>(null);

  function addTask() {
    if (!newTask.trim()) {
      toast.error("Enter a task description first.");
      return;
    }
    const line = `${newTask.trim()} — deadline ${newDeadline.trim() || "not specified"} — ${newPriority} — ${newDuration.trim() || "duration not specified"}`;
    setTasks((prev) => (prev.trim() ? `${prev.trim()}\n${line}` : line));
    setNewTask("");
    setNewDeadline("");
    setNewDuration("");
    toast.success("Task added to the list.");
  }

  async function submit() {
    if (tasks.trim().length < 5) {
      toast.error("Add at least one task before generating a schedule.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { tasks, workingHours, preferences } });
      if (res.ok) {
        setPlan(res.data);
        setSource(res.source);
        toast.success("Schedule ready. Adjust it to fit your day.");
      } else if (res.error.includes("not configured")) {
        setPlan(DEMO_PLAN);
        setSource("demo");
        toast.info("Showing demonstration content — no live AI service was used.");
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "The request could not be completed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const planText = plan
    ? plan.schedule
        .map(
          (t) =>
            `${t.startTime}–${t.endTime} · ${t.task} · ${t.priority} · ${t.duration} · deadline ${t.deadline}`,
        )
        .join("\n")
    : "";

  return (
    <AppShell>
      <PageHeader
        title="AI Task Planner"
        subtitle="Fit your workload into the hours you actually have available."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <SectionCard
          title="Your tasks"
          description="Add tasks one at a time, or edit the list directly."
          icon={<CalendarClock className="size-[18px]" aria-hidden="true" />}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Task" htmlFor="t-task">
                <TextInput
                  id="t-task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="e.g. Draft supplier renewal summary"
                />
              </Field>
              <Field label="Deadline" htmlFor="t-deadline">
                <TextInput
                  id="t-deadline"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  placeholder="e.g. Today 15:00"
                />
              </Field>
              <Field label="Priority" htmlFor="t-priority">
                <SelectInput
                  id="t-priority"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as (typeof PRIORITIES)[number])}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Estimated duration" htmlFor="t-duration">
                <TextInput
                  id="t-duration"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  placeholder="e.g. 45 min"
                />
              </Field>
            </div>
            <ActionButton variant="outline" size="sm" onClick={addTask}>
              Add task to list
            </ActionButton>

            <Field label="Task list" htmlFor="t-list" hint="One task per line.">
              <TextArea
                id="t-list"
                rows={8}
                maxLength={12000}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
              />
            </Field>

            <Field
              label="Available working hours"
              htmlFor="t-hours"
              hint="Nothing is scheduled outside these hours."
            >
              <TextInput
                id="t-hours"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="e.g. 08:30 – 16:30"
              />
            </Field>

            <Field label="Scheduling preferences (optional)" htmlFor="t-prefs">
              <TextArea
                id="t-prefs"
                rows={3}
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g. Deep work in the morning, no meetings after 15:00"
              />
            </Field>

            <div className="flex flex-wrap gap-2">
              <ActionButton onClick={() => void submit()} loading={loading}>
                Generate Schedule
              </ActionButton>
              {plan && (
                <ActionButton variant="subtle" onClick={() => void submit()}>
                  Regenerate
                </ActionButton>
              )}
            </div>
          </div>
        </SectionCard>

        <div className="min-w-0 space-y-5">
          {loading ? (
            <LoadingState label="Building your schedule…" />
          ) : error ? (
            <ErrorState message={error} onRetry={() => void submit()} />
          ) : plan ? (
            <>
              <SectionCard
                title="Today's Schedule"
                icon={<Clock className="size-[18px]" aria-hidden="true" />}
                actions={
                  <>
                    {source && <SourceBadge source={source} />}
                    <CopyButton value={planText} label="Copy plan" />
                  </>
                }
              >
                {plan.capacityWarning && (
                  <div
                    role="alert"
                    className="mb-4 flex gap-2.5 rounded-xl border border-warning/40 bg-warning/12 p-3.5 text-sm leading-relaxed text-foreground"
                  >
                    <TriangleAlert
                      className="mt-0.5 size-4 shrink-0 text-warning-foreground"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 break-words">{plan.capacityWarning}</span>
                  </div>
                )}
                <ol className="space-y-3">
                  {plan.schedule?.map((task, i) => (
                    <li
                      key={i}
                      className="min-w-0 rounded-xl border border-border bg-secondary/40 p-3.5"
                    >
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-mono text-sm font-semibold text-primary">
                          {task.startTime}–{task.endTime}
                        </span>
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-xs font-medium",
                            priorityStyles[task.priority] ?? priorityStyles["Medium"],
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm font-medium break-words text-foreground">
                        {task.task}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {task.duration} · Deadline: {task.deadline}
                      </p>
                    </li>
                  ))}
                </ol>
                {plan.notes?.length ? (
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="mb-2 text-sm font-semibold text-foreground">Planning notes</p>
                    <BulletList items={plan.notes} />
                  </div>
                ) : null}
              </SectionCard>

              <SectionCard
                title="Priority Overview"
                icon={<Flag className="size-[18px]" aria-hidden="true" />}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(
                    [
                      ["Critical", plan.priorityOverview?.critical],
                      ["High", plan.priorityOverview?.high],
                      ["Medium", plan.priorityOverview?.medium],
                      ["Low", plan.priorityOverview?.low],
                    ] as const
                  ).map(([label, items]) => (
                    <div key={label} className="min-w-0 rounded-xl border border-border p-3.5">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium",
                          priorityStyles[label],
                        )}
                      >
                        {label}
                      </span>
                      <div className="mt-2.5">
                        <BulletList items={items ?? []} empty="Nothing in this band." />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <AiNotice>
                The plan is a suggestion based on what you entered. Deadlines are never invented —
                unstated ones show as &quot;Not specified&quot;.
              </AiNotice>
            </>
          ) : (
            <EmptyState
              title="No schedule yet"
              description="Add your tasks and working hours, then select Generate Schedule to see a chronological plan for the day."
              icon={<CalendarClock className="size-5" aria-hidden="true" />}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
