export default function FilaCategoria({ nombre, total_reportes, horas_aprobadas }) {
  return (
    <div className="flex items-center justify-between rounded-[2rem] border border-slate-200 bg-white px-5 py-4 shadow-[0_18px_45px_rgba(0,55,100,0.08)]">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Categoria</p>
        <p className="mt-2 font-montserrat text-sm font-bold text-[var(--color-acc1)]">{nombre}</p>
      </div>
      <div className="flex gap-4 text-center">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="font-montserrat text-lg font-extrabold text-[var(--color-acc2)]">{total_reportes}</p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400 font-semibold">
            Reportes </p>
        </div>
        <div className="rounded-2xl bg-[rgba(42,125,225,0.06)] px-4 py-3">
          <p className="font-montserrat text-lg font-extrabold text-[var(--color-acc2)]">{horas_aprobadas}</p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400 font-semibold">
            Hrs aprobadas </p>
        </div>
      </div>
    </div>
  );
}
