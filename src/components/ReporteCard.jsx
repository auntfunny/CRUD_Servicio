import BadgeEstadoReporte from "./BadgeEstadoReporte";
import { formatFecha, formatHoras } from "../utils/reportes";
import { cardBaseClass } from "./PageShell";

function ReporteCard({ onClick, reporte, showStudent = false }) {
  return (
    <button
      className={`${cardBaseClass} items-start gap-4 text-left`}
      onClick={onClick}
      type="button"
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Reporte #{reporte.id ?? "--"}
          </p>
          <strong className="mt-3 block text-lg font-semibold text-[var(--color-acc2)]">
            {reporte.category?.name ?? "Sin categoria"}
          </strong>
        </div>
        <BadgeEstadoReporte className="shrink-0" estado={reporte.status} />
      </div>

      <div className="grid w-full gap-3 sm:grid-cols-2">
        <div className="rounded-[1.25rem] bg-white/65 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Horas
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-800">
            {formatHoras(reporte.hours_spent)}
          </p>
        </div>
        <div className="rounded-[1.25rem] bg-white/65 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Fecha
          </p>
          <p className="mt-2 text-sm font-medium text-slate-600">
            {formatFecha(reporte.created_at)}
          </p>
        </div>
      </div>

      {showStudent ? (
        <div className="w-full rounded-[1.25rem] bg-[rgba(42,125,225,0.08)] px-4 py-3 text-sm text-slate-600">
          <span className="font-semibold text-[var(--color-acc2)]">Estudiante: </span>
          {reporte.student?.full_name ?? "Sin dato"}
        </div>
      ) : null}
    </button>
  );
}

export default ReporteCard;
