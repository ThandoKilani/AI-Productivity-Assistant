import { Check, Copy, Info, Inbox, Loader2, TriangleAlert } from "lucide-react";
import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ------------------------------- Page header ------------------------------ */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/* ------------------------------ Section card ------------------------------ */

export function SectionCard({
  title,
  description,
  icon,
  actions,
  className,
  children,
}: {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6",
        className,
      )}
    >
      {(title || actions) && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              {title && <h2 className="text-base font-semibold text-foreground">{title}</h2>}
              {description && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/* --------------------------------- Badge ---------------------------------- */

export function Pill({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "primary" | "violet" | "success" | "warning" | "danger";
}) {
  const tones = {
    neutral: "bg-secondary text-secondary-foreground border-border",
    primary: "bg-primary/10 text-primary border-primary/25",
    violet: "bg-violet/10 text-violet border-violet/25",
    success: "bg-success/12 text-success border-success/25",
    warning: "bg-warning/18 text-warning-foreground border-warning/35",
    danger: "bg-destructive/10 text-destructive border-destructive/25",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* --------------------------------- Button --------------------------------- */

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "outline" | "ghost" | "subtle" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
};

export function ActionButton({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-brand text-primary-foreground shadow-card hover:brightness-110 active:brightness-95",
    outline: "border border-border bg-surface text-foreground hover:bg-secondary",
    ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
    subtle: "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
    danger: "bg-destructive text-destructive-foreground hover:brightness-110",
  };
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-55",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm",
        variants[variant],
        className,
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

/* ------------------------------ Copy control ------------------------------ */

export function CopyButton({
  value,
  label = "Copy",
  size = "sm",
}: {
  value: string;
  label?: string;
  size?: "sm" | "md";
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value.trim()) {
      toast.error("Nothing to copy yet.");
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Your browser blocked copying. Select the text and copy manually.");
    }
  }

  return (
    <ActionButton variant="outline" size={size} onClick={copy} aria-label={label}>
      {copied ? (
        <Check className="size-3.5 text-success" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
      {copied ? "Copied" : label}
    </ActionButton>
  );
}

/* ------------------------------ Form controls ----------------------------- */

export function Field({
  label,
  hint,
  htmlFor,
  children,
  required,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const controlClasses =
  "w-full min-w-0 rounded-xl border border-input bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-ring focus:outline-none";

export function TextInput(props: ComponentPropsWithoutRef<"input">) {
  return <input {...props} className={cn(controlClasses, props.className)} />;
}

export function TextArea(props: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      {...props}
      className={cn(controlClasses, "resize-y leading-relaxed", props.className)}
    />
  );
}

export function SelectInput(props: ComponentPropsWithoutRef<"select">) {
  return (
    <select {...props} className={cn(controlClasses, "appearance-none pr-9", props.className)} />
  );
}

/* -------------------------------- States ---------------------------------- */

export function LoadingState({ label = "Working on it…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/40 px-6 py-12 text-center"
    >
      <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="max-w-sm text-xs text-muted-foreground">
        This usually takes a few seconds. You can keep the page open.
      </p>
      <div className="mt-2 w-full max-w-sm space-y-2" aria-hidden="true">
        <div className="h-3 animate-pulse rounded-full bg-border" />
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-border" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-border" />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/30 px-6 py-12 text-center">
      <span className="grid size-11 place-items-center rounded-2xl bg-surface text-primary shadow-card">
        {icon ?? <Inbox className="size-5" aria-hidden="true" />}
      </span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/8 p-5"
    >
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">That didn&apos;t work</p>
          <p className="mt-1 text-sm leading-relaxed break-words text-muted-foreground">
            {message}
          </p>
        </div>
      </div>
      {onRetry && (
        <div>
          <ActionButton variant="outline" size="sm" onClick={onRetry}>
            Try again
          </ActionButton>
        </div>
      )}
    </div>
  );
}

/* --------------------------- Responsible AI note -------------------------- */

export function AiNotice({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-xl border border-border bg-secondary/50 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
    >
      <Info className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
      <span>
        {children ??
          "AI-generated content may contain errors or omissions. Review it before sending, sharing or acting on it, and avoid entering confidential information."}
      </span>
    </p>
  );
}

export function SourceBadge({ source }: { source: "live" | "demo" }) {
  return source === "live" ? (
    <Pill tone="success">Generated with Lovable AI</Pill>
  ) : (
    <Pill tone="warning">Demonstration mode — not a live AI response</Pill>
  );
}

/* -------------------------------- Bullets --------------------------------- */

export function BulletList({ items, empty }: { items: string[]; empty?: string }) {
  if (!items?.length) {
    return <p className="text-sm text-muted-foreground">{empty ?? "Not specified."}</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <span className="min-w-0 break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}
