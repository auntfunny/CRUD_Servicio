function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-[1.1rem] bg-[linear-gradient(90deg,_rgba(226,232,240,0.72),_rgba(241,245,249,0.96),_rgba(226,232,240,0.72))] bg-[length:200%_100%] ${className}`}
    />
  );
}

function PageIntroSkeleton({ withButton = true }) {
  return (
    <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0 flex-1 space-y-3">
        <SkeletonBlock className="h-3 w-28 rounded-full" />
        <SkeletonBlock className="h-10 w-full max-w-[22rem]" />
        <SkeletonBlock className="h-4 w-full max-w-[32rem]" />
        <SkeletonBlock className="h-4 w-full max-w-[24rem]" />
      </div>

      {withButton ? (
        <SkeletonBlock className="h-12 w-full max-w-[12rem] rounded-full sm:w-48" />
      ) : null}
    </section>
  );
}

export function StatsGridSkeleton({ cards = 4 }) {
  return (
    <section className={`grid gap-4 ${cards > 2 ? "md:grid-cols-2 2xl:grid-cols-4" : "md:grid-cols-2"}`}>
      {Array.from({ length: cards }).map((_, index) => (
        <article
          className="rounded-[1.55rem] border border-slate-100 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]"
          key={`stats-skeleton-${index}`}
        >
          <SkeletonBlock className="h-3 w-24 rounded-full" />
          <SkeletonBlock className="mt-4 h-10 w-28" />
          <SkeletonBlock className="mt-3 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-3/4" />
          <SkeletonBlock className="mt-5 h-1.5 w-full rounded-full" />
        </article>
      ))}
    </section>
  );
}

export function FiltersSkeleton({ controls = 4 }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/60 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:p-5">
      <div className={`grid gap-4 ${controls >= 4 ? "md:grid-cols-2 2xl:grid-cols-4" : "md:grid-cols-2"}`}>
        {Array.from({ length: controls }).map((_, index) => (
          <div className="space-y-2" key={`filter-skeleton-${index}`}>
            <SkeletonBlock className="h-4 w-24 rounded-full" />
            <SkeletonBlock className="h-12 w-full rounded-2xl" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function TableSkeleton({ columns = 5, rows = 5 }) {
  const templateColumns = `repeat(${columns}, minmax(120px, 1fr))`;

  return (
    <section className="overflow-x-auto rounded-[2rem] border border-white/70 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm">
      <div className="min-w-[760px]">
        <div
          className="grid gap-4 border-b border-slate-100 bg-slate-50/90 px-6 py-4"
          style={{ gridTemplateColumns: templateColumns }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <SkeletonBlock className="h-3 w-20 rounded-full" key={`table-head-${index}`} />
          ))}
        </div>

        <div className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              className="grid gap-4 px-6 py-4"
              key={`table-row-${rowIndex}`}
              style={{ gridTemplateColumns: templateColumns }}
            >
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <SkeletonBlock
                  className={`h-4 ${columnIndex === 0 ? "w-11/12" : columnIndex === columns - 1 ? "w-24 rounded-full" : "w-4/5"}`}
                  key={`table-cell-${rowIndex}-${columnIndex}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DashboardSkeleton({ showSidePanel = true }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <PageIntroSkeleton />
      <StatsGridSkeleton cards={4} />
      <section className={`grid gap-6 ${showSidePanel ? "2xl:grid-cols-[1.45fr_0.75fr]" : ""}`}>
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm">
            <SkeletonBlock className="h-7 w-56" />
            <SkeletonBlock className="mt-3 h-4 w-full max-w-[28rem]" />
            <TableSkeleton columns={6} rows={4} />
          </div>
        </div>

        {showSidePanel ? (
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm">
              <SkeletonBlock className="h-7 w-44" />
              <SkeletonBlock className="mt-3 h-4 w-full" />
              <SkeletonBlock className="mt-6 h-28 w-full rounded-[1.4rem]" />
              <SkeletonBlock className="mt-4 h-28 w-full rounded-[1.4rem]" />
              <SkeletonBlock className="mt-4 h-28 w-full rounded-[1.4rem]" />
            </div>
          </aside>
        ) : null}
      </section>
    </div>
  );
}

export function ListPageSkeleton({ filters = 2, columns = 5, rows = 6, withStats = true }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <PageIntroSkeleton />
      {withStats ? (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <SkeletonBlock className="h-4 w-32 rounded-full" />
          <SkeletonBlock className="h-4 w-28 rounded-full" />
          <SkeletonBlock className="h-4 w-24 rounded-full" />
          <SkeletonBlock className="h-4 w-20 rounded-full" />
        </div>
      ) : null}
      <FiltersSkeleton controls={filters} />
      <TableSkeleton columns={columns} rows={rows} />
    </div>
  );
}

export function ProfileSkeleton({ editable = false }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <section className="rounded-[2rem] border border-white/70 bg-white/58 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:p-6 xl:p-7">
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr] xl:items-start">
          <div>
            <SkeletonBlock className="h-3 w-20 rounded-full" />
            <SkeletonBlock className="mt-3 h-10 w-full max-w-[20rem]" />
            <SkeletonBlock className="mt-3 h-4 w-full max-w-[18rem]" />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <SkeletonBlock className="h-12 w-full rounded-full sm:w-44" />
              <SkeletonBlock className="h-12 w-full rounded-full sm:w-44" />
            </div>
          </div>
          <div className="flex justify-start xl:justify-end">
            <SkeletonBlock className="h-24 w-24 rounded-full" />
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm">
          <SkeletonBlock className="h-3 w-28 rounded-full" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {Array.from({ length: editable ? 8 : 8 }).map((_, index) => (
              <div className="space-y-3" key={`profile-field-${index}`}>
                <SkeletonBlock className="h-4 w-28 rounded-full" />
                <SkeletonBlock className="h-12 w-full rounded-[1.1rem]" />
              </div>
            ))}
          </div>
        </article>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] backdrop-blur-sm">
            <SkeletonBlock className="h-3 w-24 rounded-full" />
            <SkeletonBlock className="mt-5 h-4 w-full rounded-full" />
            <SkeletonBlock className="mt-3 h-4 w-4/5 rounded-full" />
            <SkeletonBlock className="mt-3 h-4 w-3/5 rounded-full" />
          </section>
        </aside>
      </section>
    </div>
  );
}
