import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Bot, RotateCcw, Send, Sparkles, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import {
  ActionButton,
  AiNotice,
  CopyButton,
  EmptyState,
  ErrorState,
  PageHeader,
  Pill,
} from "@/components/ui-kit";
import { suggestedPrompts } from "@/lib/demo-data";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Ask a workplace productivity assistant for help with planning, writing, summarising and preparing for meetings.",
      },
      { property: "og:title", content: "AI Workplace Chat" },
      {
        property: "og:description",
        content: "A professional assistant for planning, writing and meeting preparation.",
      },
    ],
  }),
  component: ChatPage,
});

function messageText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

function ChatPage() {
  const [input, setInput] = useState("");
  const [times, setTimes] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, setMessages, regenerate } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: () => toast.error("The assistant could not respond. Please try again."),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    setTimes((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const m of messages) {
        if (!next[m.id]) {
          next[m.id] = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const transcript = useMemo(
    () =>
      messages
        .map((m) => `${m.role === "user" ? "You" : "Assistant"}: ${messageText(m)}`)
        .join("\n\n"),
    [messages],
  );

  function submit(text: string) {
    const value = text.trim();
    if (!value) {
      toast.error("Type a message first.");
      return;
    }
    if (value.length > 8000) {
      toast.error("That message is too long. Please shorten it to under 8,000 characters.");
      return;
    }
    sendMessage({ text: value });
    setInput("");
  }

  return (
    <AppShell>
      <PageHeader
        title="AI Workplace Chat"
        subtitle="Talk through your work: prioritise a day, draft a message, prepare for a meeting or sanity-check a plan."
        actions={
          <>
            {messages.length > 0 && <CopyButton value={transcript} label="Copy conversation" />}
            <ActionButton
              variant="outline"
              size="sm"
              onClick={() => {
                setMessages([]);
                toast.success("Conversation cleared.");
              }}
              disabled={messages.length === 0 || busy}
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Clear
            </ActionButton>
          </>
        }
      />

      <div className="flex min-h-[62vh] min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div
          ref={scrollRef}
          className="min-w-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6"
          aria-live="polite"
          aria-label="Conversation"
        >
          {messages.length === 0 ? (
            <div className="space-y-5">
              <EmptyState
                icon={<Sparkles className="size-5" aria-hidden="true" />}
                title="Start a conversation"
                description="Pick a suggested prompt below or describe what you are working on. The assistant asks for clarification instead of guessing."
              />
              <div className="flex flex-wrap justify-center gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => submit(prompt)}
                    className="rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const mine = message.role === "user";
              const text = messageText(message);
              return (
                <article
                  key={message.id}
                  className={`flex min-w-0 gap-3 ${mine ? "flex-row-reverse" : ""}`}
                >
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                      mine ? "bg-secondary text-foreground" : "bg-brand text-primary-foreground"
                    }`}
                    aria-hidden="true"
                  >
                    {mine ? <User className="size-4" /> : <Bot className="size-4" />}
                  </span>
                  <div className={`min-w-0 max-w-[85%] ${mine ? "items-end text-right" : ""}`}>
                    <div
                      className={`flex items-center gap-2 text-xs text-muted-foreground ${
                        mine ? "justify-end" : ""
                      }`}
                    >
                      <span className="font-medium text-foreground">
                        {mine ? "You" : "Assistant"}
                      </span>
                      <span>{times[message.id] ?? ""}</span>
                    </div>
                    <div
                      className={`mt-1.5 rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                        mine
                          ? "bg-primary/10 text-foreground"
                          : "border border-border bg-surface text-foreground"
                      }`}
                    >
                      {text || (busy ? "…" : "")}
                    </div>
                    {!mine && text && (
                      <div className="mt-2 flex justify-start">
                        <CopyButton value={text} label="Copy response" />
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}

          {busy && (
            <p
              role="status"
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
            >
              <span className="flex gap-1" aria-hidden="true">
                <span className="size-1.5 animate-bounce rounded-full bg-primary" />
                <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:120ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:240ms]" />
              </span>
              The assistant is thinking…
            </p>
          )}

          {error && (
            <ErrorState
              message="The assistant could not respond. This can happen if AI is not configured on this deployment or the request timed out."
              onRetry={() => regenerate()}
            />
          )}
        </div>

        <form
          className="border-t border-border bg-surface p-3 sm:p-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
        >
          <div className="flex min-w-0 items-end gap-2">
            <label htmlFor="chat-input" className="sr-only">
              Message the assistant
            </label>
            <textarea
              id="chat-input"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              placeholder="Ask about planning, writing, summarising or preparing for a meeting…"
              className="min-w-0 flex-1 resize-none rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none"
            />
            <ActionButton type="submit" loading={busy} aria-label="Send message">
              {!busy && <Send className="size-4" aria-hidden="true" />}
              Send
            </ActionButton>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Pill tone="neutral">Enter to send · Shift+Enter for a new line</Pill>
          </div>
        </form>
      </div>

      <AiNotice className="mt-5">
        Replies are AI-generated and may be incomplete or wrong. Review anything important yourself,
        and do not paste confidential or personal information into the conversation.
      </AiNotice>
    </AppShell>
  );
}
