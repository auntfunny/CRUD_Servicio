export function PageShell({ children }) {
  return (
    <main className="space-y-6 bg-transparent">
      <section className="overflow-visible rounded-[2.2rem] bg-transparent p-0 shadow-none">
        <div className="rounded-[1.8rem] bg-transparent p-0">
          {children}
        </div>
      </section>
    </main>
  );
}

export const panelBaseClass =
  "rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm";

export const cardBaseClass =
  "group flex h-full flex-col rounded-[1.8rem] border border-white/70 bg-white/58 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/74";

export const controlClass =
  "w-full rounded-2xl border border-slate-200 bg-white/72 px-4 py-3 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] outline-none transition placeholder:text-slate-400 focus:border-[var(--color-acc1)] focus:ring-2 focus:ring-[rgba(42,125,225,0.14)]";

export const primaryButtonClass =
  "inline-flex min-w-[180px] items-center justify-center rounded-full bg-[var(--color-acc1)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(42,125,225,0.22)] transition hover:brightness-95";

export const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/72 px-5 py-3 text-sm font-semibold text-[var(--color-acc2)] shadow-[0_10px_22px_rgba(15,23,42,0.04)] transition hover:border-[rgba(42,125,225,0.28)] hover:bg-white";

export function PageHero({ eyebrow, title, description, actions, meta }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/58 p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm lg:p-7">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
        <div>
          {eyebrow ? (
            <p className="text-[15px] font-semibold uppercase tracking-[0.16em] text-[var(--color-acc1)]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 font-montserrat text-4xl font-bold leading-tight text-[var(--color-acc2)] lg:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              {description}
            </p>
          ) : null}
          {actions ? (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {actions}
            </div>
          ) : null}
        </div>

        {meta ? (
          <div className="flex justify-start lg:justify-end">
            {meta}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function StatCard({ label, value, helper, tone = "bg-slate-300" }) {
  return (
    <article className="group flex h-full flex-col rounded-[1.9rem] border border-white/70 bg-white/58 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/72">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          {label}
        </p>
        <p className="mt-3 font-montserrat text-4xl font-bold text-slate-800">
          {value}
        </p>
      </div>

      <div className="mt-5 flex min-h-[94px] flex-1 rounded-[1.3rem] bg-white/45 px-4 py-3">
        <p className="text-sm leading-6 text-slate-500">
          {helper}
        </p>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full w-16 rounded-full ${tone}`} />
      </div>
    </article>
  );
}
