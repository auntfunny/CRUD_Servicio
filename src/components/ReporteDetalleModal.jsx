import BadgeEstadoReporte from "./BadgeEstadoReporte";
import EvidenciaPdfAcciones from "./EvidenciaPdfAcciones";
import ModalBase from "./ModalBase";
import { formatFecha, formatHoras } from "../utils/reportes";

function InfoBlock({ children, label }) {
  return (
    <div className="rounded-[1.4rem] bg-slate-50/90 p-4 text-sm text-slate-600">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

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
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoBlock label="Categoria">
            <p className="font-semibold text-slate-800">{reporte.category?.name ?? "Sin categoria"}</p>
          </InfoBlock>
          <InfoBlock label="Horas">
            <p className="font-semibold text-slate-800">{formatHoras(reporte.hours_spent)}</p>
          </InfoBlock>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoBlock label="Estado">
            <BadgeEstadoReporte estado={reporte.status} />
          </InfoBlock>
          <InfoBlock label="Horas aprobadas">
            <p className="font-semibold text-slate-800">{formatHoras(reporte.approved_hours ?? 0)}</p>
          </InfoBlock>
        </div>

        <InfoBlock label="Descripcion">
          <p className="leading-6 text-slate-700">{reporte.description}</p>
        </InfoBlock>

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoBlock label="Fecha">
            <p className="font-semibold text-slate-800">{formatFecha(reporte.created_at)}</p>
          </InfoBlock>
          <InfoBlock label="Estudiante">
            <p className="font-semibold text-slate-800">{reporte.student?.full_name ?? "Sin dato"}</p>
          </InfoBlock>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Comentarios de revision
          </p>
          <p className="text-sm text-slate-700">
            {reporte.reviewer_notes ?? "Todavia no hay comentarios de revision."}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <EvidenciaPdfAcciones reporteId={reporte.id} />

        <div className="flex flex-wrap items-center gap-3">
          {canEdit ? (
            <button
              className="inline-flex min-w-[150px] items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
              onClick={onEdit}
              type="button"
            >
              Editar
            </button>
          ) : null}

          {canReview ? (
            <button
              className="inline-flex min-w-[150px] items-center justify-center rounded-full bg-[linear-gradient(180deg,_#2f80ed,_#195ec9)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(42,125,225,0.28)] transition hover:brightness-95"
              onClick={onReview}
              type="button"
            >
              Revisar
            </button>
          ) : null}
        </div>
      </div>
    </ModalBase>
  );
}

export default ReporteDetalleModal;
