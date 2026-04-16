import BadgeEstadoReporte from "./BadgeEstadoReporte";
import { formatFecha, formatHoras } from "../utils/reportes";

function ReporteCard({ onClick, reporte, showStudent = false }) {
  return (
    <button
      className="flex flex-col gap-2 rounded border p-4 text-left"
      onClick={onClick}
      type="button"
    >
      <BadgeEstadoReporte estado={reporte.status} />
      <strong>{reporte.category?.name ?? "Sin categoria"}</strong>
      <span>{formatHoras(reporte.hours_spent)}</span>
      {showStudent ? (
        <span>Estudiante: {reporte.student?.full_name ?? "Sin dato"}</span>
      ) : null}
      <span className="text-sm text-slate-500">{formatFecha(reporte.created_at)}</span>
    </button>
  );
}

export default ReporteCard;
