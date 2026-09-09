import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type {
  AiResult,
  EmailResult,
  MeetingSummary,
  ResearchBrief,
  SchedulePlan,
} from "./ai-types";

const MAX_INPUT = 12000;

const RESPONSIBLE_AI_RULES = `Responsible AI rules you must always follow:
- Use only information supplied by the user. Never invent names, dates, numbers, commitments, promises, citations, URLs or sources.
- Clearly separate explicit information from inference.
- If required information is missing, say so instead of guessing facts.
- Return valid JSON only, with no markdown code fences and no commentary outside the JSON.`;

function extractJson(text: string): unknown {
  const cleaned = text
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error("The AI response could not be read. Please try again.");
  }
}

async function runJsonPrompt<T>(system: string, prompt: string): Promise<AiResult<T>> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) {
    return { ok: false, error: "AI is not configured. Switch on demonstration mode to preview." };
  }

  try {
    const [{ streamText }, { createLovableAiGatewayProvider, AI_MODEL }] = await Promise.all([
      import("ai"),
      import("./ai-gateway.server"),
    ]);
    const gateway = createLovableAiGatewayProvider(key);
    const result = streamText({
      model: gateway(AI_MODEL),
      system: `${system}\n\n${RESPONSIBLE_AI_RULES}`,
      prompt,
    });
    const text = await result.text;
    if (!text.trim()) {
      return { ok: false, error: "The AI returned an empty response. Please try again." };
    }
    return { ok: true, source: "live", data: extractJson(text) as T };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/402/.test(message)) {
      return { ok: false, error: "AI credits are exhausted for this workspace. Add credits to continue." };
    }
    if (/429/.test(message)) {
      return { ok: false, error: "Too many requests right now. Please wait a moment and try again." };
    }
    if (/403/.test(message)) {
      return { ok: false, error: "AI access is blocked by workspace policy." };
    }
    return { ok: false, error: `AI request failed: ${message}` };
  }
}

const trimmed = (max = MAX_INPUT) => z.string().trim().max(max, "This input is too long. Please shorten it.");

/* ---------------------------------- Email --------------------------------- */

const EmailInput = z.object({
  purpose: trimmed(2000).min(3, "Describe the purpose of the email."),
  context: trimmed(4000),
  points: trimmed(6000),
  tone: z.enum(["Formal", "Friendly", "Persuasive", "Professional", "Concise"]),
  length: z.enum(["Short", "Medium", "Detailed"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }): Promise<AiResult<EmailResult>> => {
    const lengthGuide = {
      Short: "roughly 60-90 words",
      Medium: "roughly 120-180 words",
      Detailed: "roughly 220-320 words",
    }[data.length];

    return runJsonPrompt<EmailResult>(
      `You are a professional workplace communication assistant. You write clear, grammatically correct, professionally appropriate emails.
Maintain the requested tone exactly and respect the requested length.
Use a suitable subject line. Do not invent names, dates, commitments, facts, promises or details.
If essential information is missing, make the safest reasonable assumption only when it introduces no factual claim; otherwise set clarificationNeeded to a short question for the user.
Respond as JSON: {"subject": string, "body": string, "clarificationNeeded": string | null}`,
      `Tone: ${data.tone}
Length: ${data.length} (${lengthGuide})
Purpose: ${data.purpose}
Recipient / context: ${data.context || "Not specified"}
Main points to cover:
${data.points || "Not specified"}`,
    );
  });

/* ------------------------------ Meeting notes ----------------------------- */

const MeetingInput = z.object({
  notes: trimmed().min(20, "Paste at least a few lines of meeting notes."),
  title: trimmed(200),
  date: trimmed(100),
  participants: trimmed(1000),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MeetingInput.parse(input))
  .handler(async ({ data }): Promise<AiResult<MeetingSummary>> => {
    return runJsonPrompt<MeetingSummary>(
      `You summarize workplace meeting notes with strict fidelity to the source.
Only extract information present in the supplied notes. Never invent attendees, deadlines, decisions or responsibilities.
Where an owner or deadline is not stated, use exactly "Not specified". Prefix inferred statements with "Inferred: ".
Respond as JSON: {"executiveSummary": string, "keyPoints": string[], "decisions": string[], "actionItems": [{"task": string, "owner": string, "deadline": string}], "importantDates": string[], "followUpQuestions": string[]}`,
      `Meeting title: ${data.title || "Not specified"}
Meeting date: ${data.date || "Not specified"}
Participants: ${data.participants || "Not specified"}

NOTES:
${data.notes}`,
    );
  });

/* ------------------------------ Task planner ------------------------------ */

const PlannerInput = z.object({
  tasks: trimmed().min(5, "List at least one task."),
  workingHours: trimmed(200),
  preferences: trimmed(2000),
});

export const planSchedule = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }): Promise<AiResult<SchedulePlan>> => {
    return runJsonPrompt<SchedulePlan>(
      `You are a scheduling assistant. Build a realistic chronological schedule for the day.
Consider deadline urgency, importance, priority, estimated effort, available working hours, and dependencies only when explicitly provided.
Never schedule work outside the stated available working hours, and never invent deadlines (use "Not specified").
If the workload cannot realistically fit, set capacityWarning explaining this and name what should be moved or deprioritized.
Respond as JSON: {"schedule": [{"startTime": string, "endTime": string, "task": string, "priority": string, "duration": string, "deadline": string}], "priorityOverview": {"critical": string[], "high": string[], "medium": string[], "low": string[]}, "capacityWarning": string | null, "notes": string[]}`,
      `Available working hours: ${data.workingHours || "Not specified"}
Scheduling preferences: ${data.preferences || "None"}

TASKS (one per line, may include deadline, priority and estimated duration):
${data.tasks}`,
    );
  });

/* ---------------------------- Research assistant -------------------------- */

const ResearchInput = z.object({
  topic: trimmed(2000).min(5, "Enter a research question or topic."),
  sourceText: trimmed(),
  depth: z.enum(["Quick", "Standard", "Detailed"]),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }): Promise<AiResult<ResearchBrief>> => {
    const depthGuide = {
      Quick: "3 concise items per section",
      Standard: "4-5 items per section",
      Detailed: "6-8 substantive items per section",
    }[data.depth];

    return runJsonPrompt<ResearchBrief>(
      `You are a research assistant with no live web access.
Never fabricate citations, URLs, publications, statistics or sources.
State clearly in "basis" whether findings come from the material the user provided, from the model's existing knowledge without external verification, or both.
When source material is supplied, mark points drawn from it with "Based on provided material:" and your own analysis with "AI-generated analysis:".
Respond as JSON: {"basis": string, "executiveSummary": string, "keyInsights": string[], "importantFindings": string[], "recommendations": string[], "risks": string[], "furtherQuestions": string[]}`,
      `Research depth: ${data.depth} (${depthGuide})
Research question / topic: ${data.topic}

PROVIDED SOURCE MATERIAL:
${data.sourceText || "None provided."}`,
    );
  });
