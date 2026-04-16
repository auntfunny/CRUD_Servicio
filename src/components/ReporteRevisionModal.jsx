import { useState } from "react";
import ModalBase from "./ModalBase";
import { formatHoras } from "../utils/reportes";

function ReporteRevisionModal({ loading = false, onClose, onSubmit, reporte }) {
  const [approvedHours, setApprovedHours] = useState(reporte?.approved_hours ?? 0);
  const [reviewerNotes, setReviewerNotes] = useState(reporte?.reviewer_notes ?? "");
  const [errorLocal, setErrorLocal] = useState("");
  const horasReportadas = Number(reporte?.hours_spent ?? 0);

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    setErrorLocal("");

    try {
      await onSubmit({
        approved_hours: Number(approvedHours),
        reviewer_notes: reviewerNotes || null,
      });
    } catch (error) {
      const mensaje =
        error?.response?.data?.detail?.[0]?.msg ??
        "No se pudo revisar el reporte.";
      setErrorLocal(mensaje);
    }
  };

  return (
    <ModalBase onClose={onClose} title="Revisar reporte">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">
            Horas reportadas por el estudiante {reporte?.student?.full_name ?? "Sin dato"}
          </p>
          <p className="mt-1">{formatHoras(reporte?.hours_spent ?? 0)}</p>
        </div>

        <label className="flex flex-col gap-2 text-sm">
          <span>Horas aprobadas</span>
          <span className="relative block">
            <input
              className="w-full rounded border px-3 py-2 pr-24"
              min="0"
              onChange={(evento) => setApprovedHours(evento.target.value)}
              step="0.5"
              type="number"
              value={approvedHours}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
              onClick={() => setApprovedHours(horasReportadas)}
              type="button"
            >
              Usar todas
            </button>
          </span>
        </label>

        <label className="flex flex-col gap-2 text-sm">
          Comentario para el estudiante
          <textarea
            className="min-h-28 rounded border px-3 py-2"
            onChange={(evento) => setReviewerNotes(evento.target.value)}
            placeholder="Explica que estuvo bien o que debe corregir."
            value={reviewerNotes}
          />
        </label>

        {errorLocal ? <p className="text-sm text-red-600">{errorLocal}</p> : null}

        <div className="flex justify-end gap-3">
          <button className="rounded border px-4 py-2" onClick={onClose} type="button">
            Cancelar
          </button>
          <button
            className="rounded border bg-slate-900 px-4 py-2 text-white"
            disabled={loading}
            type="submit"
          >
            {loading ? "Guardando..." : "Guardar revision"}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

export default ReporteRevisionModal;
