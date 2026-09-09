import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarClock,
  BookOpen,
  MessagesSquare,
  Settings,
  ShieldCheck,
} from "lucide-react";

export const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/smart-email", label: "Smart Email", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes", icon: FileText },
  { to: "/task-planner", label: "Task Planner", icon: CalendarClock },
  { to: "/research", label: "Research Assistant", icon: BookOpen },
  { to: "/chat", label: "AI Chat", icon: MessagesSquare },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/responsible-ai", label: "Responsible AI", icon: ShieldCheck },
] as const;
