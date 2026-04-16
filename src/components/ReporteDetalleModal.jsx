import BadgeEstadoReporte from "./BadgeEstadoReporte";
import EvidenciaPdfAcciones from "./EvidenciaPdfAcciones";
import ModalBase from "./ModalBase";
import { formatFecha, formatHoras } from "../utils/reportes";

function ReporteDetalleModal({
  canEdit = false,
  canReview = false,
  onClose,
  onEdit,
  onReview,
  reporte,
}) {
  if (!reporte) return null;

  return (
    <ModalBase onClose={onClose} title="Detalle del reporte">
      <div className="space-y-3 text-sm">
        <p><strong>Categoria:</strong> {reporte.category?.name ?? "Sin categoria"}</p>
        <p><strong>Horas:</strong> {formatHoras(reporte.hours_spent)}</p>
        <div className="flex items-center gap-2">
          <strong>Estado:</strong>
          <BadgeEstadoReporte estado={reporte.status} />
        </div>
        <p><strong>Horas aprobadas:</strong> {formatHoras(reporte.approved_hours ?? 0)}</p>
        <p><strong>Descripcion:</strong> {reporte.description}</p>
        <p><strong>Fecha:</strong> {formatFecha(reporte.created_at)}</p>
        <p><strong>Estudiante:</strong> {reporte.student?.full_name ?? "Sin dato"}</p>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Comentarios de revision
          </p>
          <p className="text-sm text-slate-700">
            {reporte.reviewer_notes ?? "Todavia no hay comentarios de revision."}
          </p>
        </div>

        <EvidenciaPdfAcciones reporteId={reporte.id} />
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        {canEdit ? (
          <button className="rounded border px-4 py-2" onClick={onEdit} type="button">
            Editar
          </button>
        ) : null}

        {canReview ? (
          <button className="rounded border px-4 py-2" onClick={onReview} type="button">
            Revisar
          </button>
        ) : null}
      </div>
    </ModalBase>
  );
}

export default ReporteDetalleModal;
