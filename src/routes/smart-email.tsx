import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, PenLine } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import {
  ActionButton,
  AiNotice,
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
import { generateEmail } from "@/lib/ai.functions";
import type { AiSource } from "@/lib/ai-types";

export const Route = createFileRoute("/smart-email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Draft professional workplace emails from a few key points, with tone and length control and an editable result.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Turn a few bullet points into a clear, on-tone workplace email.",
      },
    ],
  }),
  component: SmartEmail,
});

const TONES = ["Formal", "Friendly", "Persuasive", "Professional", "Concise"] as const;
const LENGTHS = ["Short", "Medium", "Detailed"] as const;

const DEMO_EMAIL = `Dear Ms. Naidoo,

Thank you for your time last week. I am following up on the renewal of your service agreement, which is due for confirmation this month.

To keep the process simple, I have summarised the points we discussed: the current scope stays unchanged, reporting moves to a monthly cycle, and your dedicated support contact remains the same. If any of these need adjusting, let me know and I will revise the paperwork before it goes out.

Could you confirm whether the current terms still suit your team? Once you reply, I will send the renewal documents for signature.

Kind regards,
Ntombothando Kilani
Operations Lead`;

function SmartEmail() {
  const run = useServerFn(generateEmail);

  const [purpose, setPurpose] = useState("Follow up on a client contract renewal");
  const [context, setContext] = useState(
    "Ms. Naidoo, procurement contact at Meridian Logistics. We met last week to review the agreement.",
  );
  const [points, setPoints] = useState(
    "Scope stays the same\nReporting moves to a monthly cycle\nSame dedicated support contact\nAsk her to confirm the terms so documents can be sent for signature",
  );
  const [tone, setTone] = useState<(typeof TONES)[number]>("Professional");
  const [length, setLength] = useState<(typeof LENGTHS)[number]>("Medium");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<AiSource | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [clarify, setClarify] = useState<string | null>(null);

  async function submit() {
    if (purpose.trim().length < 3) {
      toast.error("Please describe the purpose of the email.");
      return;
    }
    setLoading(true);
    setError(null);
    setClarify(null);
    try {
      const result = await run({ data: { purpose, context, points, tone, length } });
      if (result.ok) {
        setSubject(result.data.subject ?? "");
        setBody(result.data.body ?? "");
        setClarify(result.data.clarificationNeeded ?? null);
        setSource(result.source);
        toast.success("Email drafted. Please review it before sending.");
      } else if (result.error.includes("not configured")) {
        setSubject("Renewal of your service agreement — confirmation needed");
        setBody(DEMO_EMAIL);
        setSource("demo");
        toast.info("Showing demonstration content — no live AI service was used.");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "The request could not be completed. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setSubject("");
    setBody("");
    setSource(null);
    setError(null);
    setClarify(null);
  }

  const hasOutput = Boolean(subject || body);

  return (
    <AppShell>
      <PageHeader
        title="Smart Email Generator"
        subtitle="Describe what you need to say — the assistant writes it in your chosen tone."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SectionCard
          title="Email details"
          description="Only the information you enter is used. Nothing is invented."
          icon={<Mail className="size-[18px]" aria-hidden="true" />}
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            <Field label="Email purpose" htmlFor="purpose" required>
              <TextInput
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Follow up on a client contract renewal"
                required
              />
            </Field>

            <Field
              label="Recipient / context"
              htmlFor="context"
              hint="Who is it for, and what do they already know?"
            >
              <TextArea
                id="context"
                rows={3}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. Procurement contact at a logistics client, met last week"
              />
            </Field>

            <Field label="Main points" htmlFor="points" hint="One point per line works best.">
              <TextArea
                id="points"
                rows={6}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="What must the email cover?"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Tone" htmlFor="tone">
                <SelectInput
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value as (typeof TONES)[number])}
                >
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Length" htmlFor="length">
                <SelectInput
                  id="length"
                  value={length}
                  onChange={(e) => setLength(e.target.value as (typeof LENGTHS)[number])}
                >
                  {LENGTHS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </div>

            <ActionButton type="submit" loading={loading} className="w-full sm:w-auto">
              Generate Email
            </ActionButton>
          </form>
        </SectionCard>

        <SectionCard
          title="AI Generated Email"
          description="Editable — adjust anything before you copy it."
          icon={<PenLine className="size-[18px]" aria-hidden="true" />}
          actions={
            hasOutput ? (
              <>
                <CopyButton value={`Subject: ${subject}\n\n${body}`} label="Copy" />
                <ActionButton variant="subtle" size="sm" onClick={() => void submit()}>
                  Regenerate
                </ActionButton>
                <ActionButton variant="ghost" size="sm" onClick={clear}>
                  Clear
                </ActionButton>
              </>
            ) : null
          }
        >
          {loading ? (
            <LoadingState label="Drafting your email…" />
          ) : error ? (
            <ErrorState message={error} onRetry={() => void submit()} />
          ) : hasOutput ? (
            <div className="space-y-4">
              {source && <SourceBadge source={source} />}
              {clarify && (
                <p className="rounded-xl border border-warning/35 bg-warning/12 px-3.5 py-2.5 text-xs leading-relaxed text-foreground">
                  <strong className="font-semibold">Clarification needed:</strong> {clarify}
                </p>
              )}
              <Field label="Subject" htmlFor="subject-out">
                <TextInput
                  id="subject-out"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </Field>
              <Field label="Email body" htmlFor="body-out">
                <TextArea
                  id="body-out"
                  rows={16}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </Field>
              <AiNotice>
                Check names, dates and any commitments against your own records before sending.
              </AiNotice>
            </div>
          ) : (
            <EmptyState
              title="No draft yet"
              description="Fill in the details on the left and select Generate Email. Your draft will appear here, ready to edit."
              icon={<Mail className="size-5" aria-hidden="true" />}
            />
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
