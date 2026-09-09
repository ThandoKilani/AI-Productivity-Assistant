import { createFileRoute } from "@tanstack/react-router";
import { Bell, Palette, Save, SlidersHorizontal, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import {
  ActionButton,
  AiNotice,
  Field,
  PageHeader,
  SectionCard,
  SelectInput,
  TextInput,
} from "@/components/ui-kit";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Set your theme, notifications, default email tone, response length and AI assistance preferences.",
      },
      { property: "og:title", content: "Settings" },
      {
        property: "og:description",
        content: "Personalise the assistant: theme, notifications, tone and response length.",
      },
    ],
  }),
  component: SettingsPage,
});

type Prefs = {
  name: string;
  role: string;
  email: string;
  theme: "system" | "light" | "dark";
  notifications: "all" | "important" | "none";
  tone: string;
  length: string;
  suggestions: "on" | "off";
  autoDisclaimer: "on" | "off";
};

const DEFAULTS: Prefs = {
  name: "Ntombothando Kilani",
  role: "Operations Lead",
  email: "ntombothando@company.com",
  theme: "system",
  notifications: "important",
  tone: "Professional",
  length: "Medium",
  suggestions: "on",
  autoDisclaimer: "on",
};

const STORAGE_KEY = "awpa-preferences";

function applyTheme(theme: Prefs["theme"]) {
  const root = document.documentElement;
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
}

function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Prefs>) });
    } catch {
      /* ignore unreadable preferences */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) applyTheme(prefs.theme);
  }, [loaded, prefs.theme]);

  function set<K extends keyof Prefs>(key: K, value: Prefs[K]) {
    setPrefs((p) => ({ ...p, [key]: value }));
  }

  function save() {
    if (!prefs.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (prefs.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(prefs.email.trim())) {
      toast.error("That email address doesn't look right.");
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      toast.success("Preferences saved on this device.");
    } catch {
      toast.error("Your browser blocked saving preferences on this device.");
    }
  }

  function reset() {
    setPrefs(DEFAULTS);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    toast.success("Preferences reset to defaults.");
  }

  return (
    <AppShell>
      <PageHeader
        title="Settings"
        subtitle="Personalise how the assistant behaves. Preferences are stored on this device only."
        actions={
          <>
            <ActionButton variant="outline" size="sm" onClick={reset}>
              Reset
            </ActionButton>
            <ActionButton size="sm" onClick={save}>
              <Save className="size-3.5" aria-hidden="true" />
              Save changes
            </ActionButton>
          </>
        }
      />

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <SectionCard
          title="Profile"
          description="Shown in the header and used to personalise greetings."
          icon={<UserRound className="size-4" aria-hidden="true" />}
        >
          <div className="space-y-4">
            <Field label="Full name" htmlFor="pref-name" required>
              <TextInput
                id="pref-name"
                value={prefs.name}
                onChange={(e) => set("name", e.target.value)}
                autoComplete="name"
              />
            </Field>
            <Field label="Job title" htmlFor="pref-role">
              <TextInput
                id="pref-role"
                value={prefs.role}
                onChange={(e) => set("role", e.target.value)}
              />
            </Field>
            <Field label="Work email" htmlFor="pref-email" hint="Used only on this device.">
              <TextInput
                id="pref-email"
                type="email"
                value={prefs.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
              />
            </Field>
          </div>
        </SectionCard>

        <SectionCard
          title="Appearance"
          description="Choose a light or dark workspace, or follow your system setting."
          icon={<Palette className="size-4" aria-hidden="true" />}
        >
          <Field label="Theme preference" htmlFor="pref-theme">
            <SelectInput
              id="pref-theme"
              value={prefs.theme}
              onChange={(e) => set("theme", e.target.value as Prefs["theme"])}
            >
              <option value="system">Match my system</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </SelectInput>
          </Field>
        </SectionCard>

        <SectionCard
          title="Notifications"
          description="Control how often the assistant interrupts you."
          icon={<Bell className="size-4" aria-hidden="true" />}
        >
          <Field label="Notification preference" htmlFor="pref-notifications">
            <SelectInput
              id="pref-notifications"
              value={prefs.notifications}
              onChange={(e) => set("notifications", e.target.value as Prefs["notifications"])}
            >
              <option value="all">All updates</option>
              <option value="important">Important only</option>
              <option value="none">Mute notifications</option>
            </SelectInput>
          </Field>
        </SectionCard>

        <SectionCard
          title="AI assistance"
          description="Defaults applied when you open a tool for the first time."
          icon={<SlidersHorizontal className="size-4" aria-hidden="true" />}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Default email tone" htmlFor="pref-tone">
              <SelectInput
                id="pref-tone"
                value={prefs.tone}
                onChange={(e) => set("tone", e.target.value)}
              >
                {["Formal", "Friendly", "Persuasive", "Professional", "Concise"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Default response length" htmlFor="pref-length">
              <SelectInput
                id="pref-length"
                value={prefs.length}
                onChange={(e) => set("length", e.target.value)}
              >
                {["Short", "Medium", "Detailed"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Suggested prompts" htmlFor="pref-suggestions">
              <SelectInput
                id="pref-suggestions"
                value={prefs.suggestions}
                onChange={(e) => set("suggestions", e.target.value as Prefs["suggestions"])}
              >
                <option value="on">Show suggestions</option>
                <option value="off">Hide suggestions</option>
              </SelectInput>
            </Field>
            <Field label="Review reminders" htmlFor="pref-disclaimer">
              <SelectInput
                id="pref-disclaimer"
                value={prefs.autoDisclaimer}
                onChange={(e) => set("autoDisclaimer", e.target.value as Prefs["autoDisclaimer"])}
              >
                <option value="on">Always remind me to review output</option>
                <option value="off">Remind me less often</option>
              </SelectInput>
            </Field>
          </div>
        </SectionCard>
      </div>

      <AiNotice className="mt-5">
        Preferences change how outputs are drafted, not how accurate they are. Always review
        AI-generated content before sending or acting on it.
      </AiNotice>
    </AppShell>
  );
}
