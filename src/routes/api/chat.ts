import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { AI_MODEL, createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are an AI workplace productivity assistant.
Help users with professional communication, planning, summarization, research assistance and workplace organization.
Be concise, useful and professional. Prefer short paragraphs and bullet lists.
Do not fabricate information. Ask for clarification when necessary.
Do not present unsupported claims as verified facts, and never invent names, dates, statistics, citations or URLs.
Do not make high-stakes professional decisions on behalf of the user; instead outline options and trade-offs.
Encourage human review of important outputs.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("AI is not configured on this deployment.", { status: 503 });
        }

        const gateway = createLovableAiGatewayProvider(key);

        const result = streamText({
          model: gateway(AI_MODEL),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
          abortSignal: request.signal,
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
