import type { ComponentProps, ReactNode } from "react";

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Farm operations</p>
      <h2 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">{title}</h2>
      <p className="max-w-2xl text-sm leading-6 text-gray-600">{description}</p>
    </div>
  );
}

export function DashboardCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}>{children}</article>;
}

export function MetricCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <DashboardCard>
      <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      <p className="mt-2 text-2xl font-semibold text-gray-950">{value}</p>
      {helper ? <p className="mt-2 text-xs text-gray-500">{helper}</p> : null}
    </DashboardCard>
  );
}

export function Notice({ children, tone }: { children: ReactNode; tone: "warning" | "error" }) {
  const classes = tone === "error" ? "border-red-200 bg-red-50 text-red-900" : "border-amber-200 bg-amber-50 text-amber-900";
  return <p className={`rounded-2xl border p-4 text-sm ${classes}`}>{children}</p>;
}

export function AppButton(props: ComponentProps<"button">) {
  return <button {...props} className={`rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${props.className ?? ""}`} />;
}

export function inputClasses() {
  return "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100";
}
