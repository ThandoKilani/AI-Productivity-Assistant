export const stats = [
  { label: "Emails Generated", value: 128, delta: "+12 this week", tone: "primary" as const },
  { label: "Meetings Summarized", value: 43, delta: "+5 this week", tone: "violet" as const },
  { label: "Tasks Planned", value: 216, delta: "+27 this week", tone: "success" as const },
  { label: "Research Sessions", value: 31, delta: "+3 this week", tone: "warning" as const },
];

export const recentActivity = [
  {
    title: "Client follow-up email — Meridian Logistics",
    detail: "Persuasive tone, medium length. Edited before sending.",
    time: "08:42",
    kind: "Smart Email",
  },
  {
    title: "Weekly team meeting summary",
    detail: "6 action items extracted, 2 decisions recorded.",
    time: "Yesterday, 16:10",
    kind: "Meeting Notes",
  },
  {
    title: "Onboarding portal launch plan",
    detail: "9 tasks scheduled across 08:30–16:30 working hours.",
    time: "Yesterday, 09:05",
    kind: "Task Planner",
  },
  {
    title: "Research: hybrid work productivity metrics",
    detail: "Standard depth brief with 5 recommendations.",
    time: "Monday, 14:22",
    kind: "Research",
  },
  {
    title: "Chat: preparing for the Q3 budget review",
    detail: "Agenda checklist and three clarifying questions.",
    time: "Monday, 11:48",
    kind: "AI Chat",
  },
];

export const todaysPriorities = [
  {
    task: "Send Meridian Logistics contract renewal email",
    priority: "Critical" as const,
    due: "Today, 11:00",
    duration: "30 min",
  },
  {
    task: "Finalise onboarding portal launch checklist",
    priority: "High" as const,
    due: "Today, 15:00",
    duration: "1 h 30 min",
  },
  {
    task: "Review supplier invoices for August",
    priority: "Medium" as const,
    due: "Tomorrow, 12:00",
    duration: "45 min",
  },
  {
    task: "Update team wiki with new leave process",
    priority: "Low" as const,
    due: "Friday",
    duration: "25 min",
  },
];

export const sampleMeetingNotes = `Weekly team meeting — 8 September
Present: Thabo (PM), Ntombothando (Ops), Lerato (Design), Sipho (Dev)

- Thabo reported the onboarding portal is 70% complete. Dev work slipped by three days because of the single sign-on integration.
- Sipho said SSO testing needs a sandbox account from IT. He will request it today.
- Lerato shared the revised dashboard layout. The team agreed to move ahead with option B.
- Ntombothando raised that support tickets doubled after the August release. Root cause not yet clear.
- Decision: launch date moves from 19 September to 26 September.
- Decision: weekly check-ins continue on Tuesdays at 09:00.
- Lerato to hand over final assets by 15 September.
- Open question: do we need extra support cover for launch week?`;

export const sampleTaskList = `Send Meridian Logistics contract renewal email — deadline today 11:00 — Critical — 30 min
Finalise onboarding portal launch checklist — deadline today 15:00 — High — 90 min
Prepare Q3 budget review slides — deadline Friday — High — 120 min
Review supplier invoices for August — deadline tomorrow 12:00 — Medium — 45 min
Update team wiki with new leave process — no deadline — Low — 25 min
1:1 with Sipho about SSO testing — today 14:00 fixed — Medium — 30 min`;

export const suggestedPrompts = [
  "Help me prioritize today's work.",
  "Draft a professional email.",
  "Summarize these notes.",
  "Create a weekly plan.",
  "Help me prepare for a meeting.",
];

export const priorityStyles: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/25",
  High: "bg-warning/15 text-warning-foreground border-warning/35",
  Medium: "bg-primary/10 text-primary border-primary/25",
  Low: "bg-muted text-muted-foreground border-border",
};
