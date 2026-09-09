import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarDays, CheckSquare, FileText, HelpCircle, Gavel, ListChecks } from "lucide-react";
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
  Pill,
  SectionCard,
  SourceBadge,
  TextArea,
  TextInput,
} from "@/components/ui-kit";
import { summarizeMeeting } from "@/lib/ai.functions";
import type { AiSource, MeetingSummary } from "@/lib/ai-types";
import { sampleMeetingNotes } from "@/lib/demo-data";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into an executive summary, decisions, action items, dates and follow-up questions.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Structured summaries extracted strictly from the notes you paste in.",
      },
    ],
  }),
  component: MeetingNotes,
});

const DEMO_SUMMARY: MeetingSummary = {
  executiveSummary:
    "The team reviewed onboarding portal progress, agreed a new launch date of 26 September, and selected dashboard layout option B. Support ticket volume after the August release remains unexplained.",
  keyPoints: [
    "Onboarding portal is 70% complete; development slipped three days due to single sign-on integration.",
    "SSO testing is blocked until IT provides a sandbox account; Sipho will request it today.",
    "Lerato presented a revised dashboard layout and the team preferred option B.",
    "Support tickets doubled after the August release and the root cause is not yet clear.",
  ],
  decisions: [
    "Launch date moves from 19 September to 26 September.",
    "Weekly check-ins continue on Tuesdays at 09:00.",
    "Proceed with dashboard layout option B.",
  ],
  actionItems: [
    { task: "Request an SSO sandbox account from IT", owner: "Sipho", deadline: "Today" },
    { task: "Hand over final design assets", owner: "Lerato", deadline: "15 September" },
    {
      task: "Investigate the increase in support tickets after the August release",
      owner: "Not specified",
      deadline: "Not specified",
    },
  ],
  importantDates: ["8 September — meeting date", "15 September — design asset handover", "26 September — new launch date"],
  followUpQuestions: [
    "Is extra support cover needed for launch week?",
    "What is the root cause of the doubled support tickets?",
  ],
};

function MeetingNotes() {
  const run = useServerFn(summarizeMeeting);

  const [notes, setNotes] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<AiSource | null>(null);
  const [result, setResult] = useState<MeetingSummary | null>(null);

  async function submit() {
    if (notes.trim().length < 20) {
      toast.error("Paste at least a few lines of meeting notes first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { notes, title, date, participants } });
      if (res.ok) {
        setResult(res.data);
        setSource(res.source);
        toast.success("Summary ready. Please check it against your notes.");
      } else if (res.error.includes("not configured")) {
        setResult(DEMO_SUMMARY);
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

  const plainText = result
    ? [
        `Executive summary: ${result.executiveSummary}`,
        `Key discussion points:\n- ${result.keyPoints.join("\n- ")}`,
        `Decisions:\n- ${result.decisions.join("\n- ")}`,
        `Action items:\n${result.actionItems
          .map((a) => `- ${a.task} (Owner: ${a.owner}; Deadline: ${a.deadline})`)
          .join("\n")}`,
        `Important dates:\n- ${result.importantDates.join("\n- ")}`,
        `Follow-up questions:\n- ${result.followUpQuestions.join("\n- ")}`,
      ].join("\n\n")
    : "";

  return (
    <AppShell>
      <PageHeader
        title="Meeting Notes Summarizer"
        subtitle="Paste your notes — only what is written there is extracted."
        actions={
          <ActionButton
            variant="outline"
            size="sm"
            onClick={() => {
              setNotes(sampleMeetingNotes);
              setTitle("Weekly team meeting");
              setDate("8 September 2026");
              setParticipants("Thabo (PM), Ntombothando (Ops), Lerato (Design), Sipho (Dev)");
            }}
          >
            Load example notes
          </ActionButton>
        }
      />

      <SectionCard
        title="Meeting input"
        icon={<FileText className="size-[18px]" aria-hidden="true" />}
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Meeting title (optional)" htmlFor="m-title">
              <TextInput
                id="m-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Weekly team meeting"
              />
            </Field>
            <Field label="Meeting date (optional)" htmlFor="m-date">
              <TextInput
                id="m-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="8 September 2026"
              />
            </Field>
            <Field label="Participants (optional)" htmlFor="m-people">
              <TextInput
                id="m-people"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="Thabo, Lerato, Sipho"
              />
            </Field>
          </div>

          <Field
            label="Paste your meeting notes"
            htmlFor="m-notes"
            required
            hint={`${notes.length.toLocaleString()} / 12,000 characters`}
          >
            <TextArea
              id="m-notes"
              rows={12}
              maxLength={12000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste the raw notes exactly as they were taken…"
              required
            />
          </Field>

          <div className="flex flex-wrap gap-2">
            <ActionButton type="submit" loading={loading}>
              Summarize Meeting
            </ActionButton>
            {result && (
              <>
                <ActionButton variant="subtle" onClick={() => void submit()}>
                  Regenerate
                </ActionButton>
                <ActionButton
                  variant="ghost"
                  onClick={() => {
                    setResult(null);
                    setSource(null);
                    setError(null);
                  }}
                >
                  Reset output
                </ActionButton>
              </>
            )}
          </div>
        </form>
      </SectionCard>

      <div className="mt-5">
        {loading ? (
          <LoadingState label="Reading your notes…" />
        ) : error ? (
          <ErrorState message={error} onRetry={() => void submit()} />
        ) : result ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {source && <SourceBadge source={source} />}
              <CopyButton value={plainText} label="Copy summary" />
            </div>

            <SectionCard
              title="Executive Summary"
              icon={<FileText className="size-[18px]" aria-hidden="true" />}
            >
              <p className="text-sm leading-relaxed break-words text-foreground">
                {result.executiveSummary}
              </p>
            </SectionCard>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <SectionCard
                title="Key Discussion Points"
                icon={<ListChecks className="size-[18px]" aria-hidden="true" />}
              >
                <BulletList items={result.keyPoints} empty="No discussion points found." />
              </SectionCard>
              <SectionCard
                title="Decisions"
                icon={<Gavel className="size-[18px]" aria-hidden="true" />}
              >
                <BulletList items={result.decisions} empty="No decisions recorded in the notes." />
              </SectionCard>
            </div>

            <SectionCard
              title="Action Items"
              icon={<CheckSquare className="size-[18px]" aria-hidden="true" />}
            >
              {result.actionItems?.length ? (
                <ul className="space-y-3">
                  {result.actionItems.map((item, i) => (
                    <li
                      key={i}
                      className="min-w-0 rounded-xl border border-border bg-secondary/40 p-3.5"
                    >
                      <p className="text-sm font-medium break-words text-foreground">{item.task}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Pill tone={item.owner === "Not specified" ? "neutral" : "primary"}>
                          Owner: {item.owner}
                        </Pill>
                        <Pill tone={item.deadline === "Not specified" ? "neutral" : "violet"}>
                          Deadline: {item.deadline}
                        </Pill>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No action items found.</p>
              )}
            </SectionCard>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <SectionCard
                title="Important Dates"
                icon={<CalendarDays className="size-[18px]" aria-hidden="true" />}
              >
                <BulletList items={result.importantDates} empty="No dates mentioned." />
              </SectionCard>
              <SectionCard
                title="Follow-up Questions"
                icon={<HelpCircle className="size-[18px]" aria-hidden="true" />}
              >
                <BulletList items={result.followUpQuestions} empty="Nothing left unresolved." />
              </SectionCard>
            </div>

            <AiNotice>
              Owners and deadlines show &quot;Not specified&quot; when the notes do not state them.
              Confirm responsibilities with your team before sharing.
            </AiNotice>
          </div>
        ) : (
          <EmptyState
            title="No summary yet"
            description="Paste your meeting notes above and select Summarize Meeting. Decisions, action items and dates will appear here."
            icon={<FileText className="size-5" aria-hidden="true" />}
          />
        )}
      </div>
    </AppShell>
  );
}
