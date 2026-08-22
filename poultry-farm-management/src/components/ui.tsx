import type { ComponentProps, ReactNode } from "react";

/** Section eyebrow + heading, used at the top of every page. */
export function PageHeader({
  title,
  description,
  action,
  signature = false,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  /** Show the carton-rule divider beneath the header. Reserve this for the dashboard only. */
  signature?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-barn-700">
            <span className="egg-shape h-2 w-2.5 bg-amber-500" aria-hidden="true" />
            Farm operations
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">{title}</h2>
          <p className="max-w-2xl text-sm leading-6 text-stone-600">{description}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {signature ? <div className="carton-rule" aria-hidden="true" /> : null}
    </div>
  );
}

/** Generic card surface. Prefer FormCard/DashboardCard wrappers over using this directly for forms. */
export function DashboardCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}>{children}</article>;
}

/** A card built around a single form: title, optional helper copy, then fields. */
export function FormCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <DashboardCard className={`space-y-4 ${className}`}>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-stone-950">{title}</h3>
        {description ? <p className="text-sm text-stone-500">{description}</p> : null}
      </div>
      <div className="space-y-3">{children}</div>
    </DashboardCard>
  );
}

/** The single most important number on a page, given real visual weight instead of blending into a grid. */
export function HeroStat({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <article className="relative overflow-hidden rounded-3xl bg-barn-900 p-6 text-white shadow-md sm:p-8">
      <span className="egg-shape absolute -right-8 -top-12 h-44 w-32 bg-white/[0.04]" aria-hidden="true" />
      <span className="egg-shape absolute -right-1 top-10 h-16 w-11 bg-amber-400/25" aria-hidden="true" />
      <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-barn-200">{label}</p>
      <p className="tabular relative mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{value}</p>
      {helper ? <p className="relative mt-2 text-sm text-barn-100">{helper}</p> : null}
    </article>
  );
}

export function MetricCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <DashboardCard>
      <h3 className="text-sm font-medium text-stone-500">{label}</h3>
      <p className="tabular mt-2 text-2xl font-semibold text-stone-950">{value}</p>
      {helper ? <p className="mt-2 text-xs text-stone-500">{helper}</p> : null}
    </DashboardCard>
  );
}

/** Compact summary line item, e.g. "Revenue ₦12,000" inside a card. */
export function SummaryRow({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-stone-100 py-2 text-sm last:border-b-0 last:pb-0">
      <span className="text-stone-500">{label}</span>
      <span className={`tabular ${emphasis ? "font-semibold text-stone-950" : "font-medium text-stone-800"}`}>{value}</span>
    </div>
  );
}

export function Notice({ children, tone }: { children: ReactNode; tone: "warning" | "error" | "info" }) {
  const classes =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : tone === "info"
        ? "border-barn-200 bg-barn-50 text-barn-900"
        : "border-amber-200 bg-amber-50 text-amber-900";
  return <p className={`rounded-2xl border p-4 text-sm leading-6 ${classes}`}>{children}</p>;
}

/** Dashed placeholder for a list/section with no records yet. Invites the next action instead of just saying "empty". */
export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-6 text-center">
      <p className="text-sm font-semibold text-stone-700">{title}</p>
      {description ? <p className="mt-1 text-sm text-stone-500">{description}</p> : null}
    </div>
  );
}

/** Small status label, e.g. flock status. Color communicates state but the text is always present too. */
export function Pill({ tone, children }: { tone: "active" | "neutral" | "warning"; children: ReactNode }) {
  const classes =
    tone === "active"
      ? "bg-barn-50 text-barn-800"
      : tone === "warning"
        ? "bg-amber-50 text-amber-800"
        : "bg-stone-100 text-stone-600";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}>{children}</span>;
}

export function AppButton(props: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={`inline-flex w-full items-center justify-center rounded-full bg-barn-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-barn-800 focus:outline-none focus:ring-2 focus:ring-barn-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${props.className ?? ""}`}
    />
  );
}

/** Lower-emphasis action, e.g. "Apply" on a date filter, sitting next to primary actions. */
export function SecondaryButton(props: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={`inline-flex w-full items-center justify-center rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-barn-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${props.className ?? ""}`}
    />
  );
}

export function inputClasses() {
  return "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 shadow-sm focus:border-barn-500 focus:outline-none focus:ring-2 focus:ring-barn-100";
}

/** Label + control wrapper. Every form control gets a visible label per the accessibility spec. */
export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-stone-700">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-stone-400">{hint}</p> : null}
    </div>
  );
}

type TextFieldProps = ComponentProps<"input"> & { label: string; hint?: string };

export function TextField({ label, hint, id, name, className, ...rest }: TextFieldProps) {
  const fieldId = id ?? name;
  return (
    <Field label={label} hint={hint} htmlFor={fieldId}>
      <input id={fieldId} name={name} className={`${inputClasses()} ${className ?? ""}`} {...rest} />
    </Field>
  );
}

type SelectFieldProps = ComponentProps<"select"> & { label: string; hint?: string };

export function SelectField({ label, hint, id, name, className, children, ...rest }: SelectFieldProps) {
  const fieldId = id ?? name;
  return (
    <Field label={label} hint={hint} htmlFor={fieldId}>
      <select id={fieldId} name={name} className={`${inputClasses()} ${className ?? ""}`} {...rest}>
        {children}
      </select>
    </Field>
  );
}
