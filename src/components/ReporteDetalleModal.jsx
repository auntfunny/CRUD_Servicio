import ModalBase from "./ModalBase";
import { formatFecha, formatHoras, getEstadoLabel } from "../utils/reportes";

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
    <ModalBase onClose={onClose} title={`Reporte #${reporte.id}`}>
      <div className="space-y-3 text-sm">
        <p><strong>Categoria:</strong> {reporte.category?.name ?? "Sin categoria"}</p>
        <p><strong>Horas:</strong> {formatHoras(reporte.hours_spent)}</p>
        <p><strong>Estado:</strong> {getEstadoLabel(reporte.status)}</p>
        <p><strong>Horas aprobadas:</strong> {formatHoras(reporte.approved_hours ?? 0)}</p>
        <p><strong>Descripcion:</strong> {reporte.description}</p>
        <p><strong>Fecha:</strong> {formatFecha(reporte.created_at)}</p>
        <p><strong>Estudiante:</strong> {reporte.student?.full_name ?? "Sin dato"}</p>
        <p><strong>Notas de revision:</strong> {reporte.reviewer_notes ?? "Sin notas"}</p>

        {reporte.web_view_link ? (
          <a
            className="inline-block rounded border px-3 py-2"
            href={reporte.web_view_link}
            rel="noreferrer"
            target="_blank"
          >
            Ver archivo
          </a>
        ) : null}
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
