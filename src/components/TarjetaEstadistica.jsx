export default function TarjetaEstadistica({ value, label, tone = "" }) {
  return (
    <div
      className={`rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-5 shadow-[0_18px_45px_rgba(0,55,100,0.08)] ring-1 ring-white ${tone}`}
    >
      <p className="font-montserrat text-4xl font-extrabold text-[var(--color-acc2)]">
        {value}
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>
    </div>
  );
}
