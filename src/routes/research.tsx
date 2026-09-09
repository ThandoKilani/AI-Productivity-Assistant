import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, HelpCircle, Lightbulb, ListChecks, ShieldAlert, Target } from "lucide-react";
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
  SelectInput,
  SourceBadge,
  TextArea,
  TextInput,
} from "@/components/ui-kit";
import { researchTopic } from "@/lib/ai.functions";
import type { AiSource, ResearchBrief } from "@/lib/ai-types";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Build a structured research brief with insights, findings, recommendations, risks and open questions — without fabricated sources.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Structured briefs from your own material plus clearly labelled AI analysis.",
      },
    ],
  }),
  component: Research;
});

const DEPTHS = ["Quick", "Standard", "Detailed"] as const;

const DEMO_BRIEF: ResearchBrief = {
  basis:
    "Demonstration content. No live AI service and no external web search were used, and no source material was analysed.",
  executiveSummary:
    "Hybrid work productivity is usually measured through a mix of output, collaboration health and employee wellbeing rather than hours logged. Organisations that define outcomes per role tend to report clearer results than those tracking activity.",
  keyInsights: [
    "AI-generated analysis: outcome-based measures travel better across roles than activity metrics.",
    "AI-generated analysis: collaboration quality is often the first thing to degrade in hybrid teams.",
    "AI-generated analysis: measurement frameworks fail when employees are not told how data is used.",
  ],
  importantFindings: [
    "AI-generated analysis: teams with written norms for meeting-free time report fewer coordination gaps.",
    "AI-generated analysis: onboarding is disproportionately affected by reduced in-office overlap.",
  ],
  recommendations: [
    "Define two or three outcome measures per role before choosing any tooling.",
    "Agree shared overlap hours for collaboration-heavy work.",
    "Review measures quarterly with the teams they apply to.",
  ],
  risks: [
    "No statistics or studies are cited here; figures must be sourced from your own research.",
    "Recommendations are generic and may not fit your organisation's policies.",
  ],
  furtherQuestions: [
    "Which roles are in scope for the measurement framework?",
    "What data does your organisation already collect, and under what policy?",
  ],
};

function Research() {
  const run = useServerFn(researchTopic);

  const [topic, setTopic] = useState("How should we measure productivity in a hybrid team?");
  const [sourceText, setSourceText] = useState("");
  const [depth, setDepth] = useState<(typeof DEPTHS)[number]>("Standard");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<AiSource | null>(null);
  const [brief, setBrief] = useState<ResearchBrief | null>(null);

  async function submit() {
    if (topic.trim().length < 5) {
      toast.error("Enter a research question or topic first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { topic, sourceText, depth } });
      if (res.ok) {
        setBrief(res.data);
        setSource(res.source);
        toast.success("Research brief ready.");
      } else if (res.error.includes("not configured")) {
        setBrief(DEMO_BRIEF);
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

  const briefText = brief
    ? [
        brief.basis,
        `Executive summary: ${brief.executiveSummary}`,
        `Key insights:\n- ${brief.keyInsights.join("\n- ")}`,
        `Important findings:\n- ${brief.importantFindings.join("\n- ")}`,
        `Recommendations:\n- ${brief.recommendations.join("\n- ")}`,
        `Risks and limitations:\n- ${brief.risks.join("\n- ")}`,
        `Further questions:\n- ${brief.furtherQuestions.join("\n- ")}`,
      ].join("\n\n")
    : "";

  return (
    <AppShell>
      <PageHeader
        title="AI Research Assistant"
        subtitle="Structured briefs from your own material plus clearly labelled AI analysis."
      />

      <SectionCard
        title="Research request"
        description="There is no live web search. Paste any source material you want analysed."
        icon={<BookOpen className="size-[18px]" aria-hidden="true" />}
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
            <Field label="Research question or topic" htmlFor="r-topic" required>
              <TextInput
                id="r-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How should we measure productivity in a hybrid team?"
                required
              />
            </Field>
            <Field label="Research depth" htmlFor="r-depth">
              <SelectInput
                id="r-depth"
                value={depth}
                onChange={(e) => setDepth(e.target.value as (typeof DEPTHS)[number])}
              >
                {DEPTHS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>

          <Field
            label="Source or article text (optional)"
            htmlFor="r-source"
            hint={`${sourceText.length.toLocaleString()} / 12,000 characters`}
          >
            <TextArea
              id="r-source"
              rows={8}
              maxLength={12000}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Paste an article, report extract or internal document…"
            />
          </Field>

          <div className="flex flex-wrap gap-2">
            <ActionButton type="submit" loading={loading}>
              Research Topic
            </ActionButton>
            {brief && (
              <>
                <ActionButton variant="subtle" onClick={() => void submit()}>
                  Regenerate
                </ActionButton>
                <ActionButton
                  variant="ghost"
                  onClick={() => {
                    setBrief(null);
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
          <LoadingState label="Compiling your brief…" />
        ) : error ? (
          <ErrorState message={error} onRetry={() => void submit()} />
        ) : brief ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {source && <SourceBadge source={source} />}
              <Pill tone="neutral">No live web search</Pill>
              <CopyButton value={briefText} label="Copy brief" />
            </div>

            <SectionCard title="Basis of this response">
              <p className="text-sm leading-relaxed break-words text-muted-foreground">
                {brief.basis}
              </p>
            </SectionCard>

            <SectionCard
              title="Executive Summary"
              icon={<Target className="size-[18px]" aria-hidden="true" />}
            >
              <p className="text-sm leading-relaxed break-words text-foreground">
                {brief.executiveSummary}
              </p>
            </SectionCard>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <SectionCard
                title="Key Insights"
                icon={<Lightbulb className="size-[18px]" aria-hidden="true" />}
              >
                <BulletList items={brief.keyInsights} />
              </SectionCard>
              <SectionCard
                title="Important Findings"
                icon={<ListChecks className="size-[18px]" aria-hidden="true" />}
              >
                <BulletList items={brief.importantFindings} />
              </SectionCard>
              <SectionCard
                title="Recommendations"
                icon={<Target className="size-[18px]" aria-hidden="true" />}
              >
                <BulletList items={brief.recommendations} />
              </SectionCard>
              <SectionCard
                title="Potential Risks / Limitations"
                icon={<ShieldAlert className="size-[18px]" aria-hidden="true" />}
              >
                <BulletList items={brief.risks} />
              </SectionCard>
            </div>

            <SectionCard
              title="Further Questions"
              icon={<HelpCircle className="size-[18px]" aria-hidden="true" />}
            >
              <BulletList items={brief.furtherQuestions} />
            </SectionCard>

            <AiNotice>
              No citations, URLs or statistics are generated here. Verify any figure you intend to
              use against a real source.
            </AiNotice>
          </div>
        ) : (
          <EmptyState
            title="No brief yet"
            description="Enter a research question, optionally paste source material, then select Research Topic."
            icon={<BookOpen className="size-5" aria-hidden="true" />}
          />
        )}
      </div>
    </AppShell>
  );
}
