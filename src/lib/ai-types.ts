export type AiSource = "live" | "demo";

export type AiResult<T> =
  | { ok: true; source: AiSource; data: T }
  | { ok: false; error: string };

export type EmailResult = {
  subject: string;
  body: string;
  clarificationNeeded?: string | null;
};

export type ActionItem = {
  task: string;
  owner: string;
  deadline: string;
};

export type MeetingSummary = {
  executiveSummary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  importantDates: string[];
  followUpQuestions: string[];
};

export type ScheduledTask = {
  startTime: string;
  endTime: string;
  task: string;
  priority: "Critical" | "High" | "Medium" | "Low" | string;
  duration: string;
  deadline: string;
};

export type SchedulePlan = {
  schedule: ScheduledTask[];
  priorityOverview: {
    critical: string[];
    high: string[];
    medium: string[];
    low: string[];
  };
  capacityWarning: string | null;
  notes: string[];
};

export type ResearchBrief = {
  basis: string;
  executiveSummary: string;
  keyInsights: string[];
  importantFindings: string[];
  recommendations: string[];
  risks: string[];
  furtherQuestions: string[];
};
