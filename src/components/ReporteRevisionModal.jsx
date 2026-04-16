import { useState } from "react";
import ModalBase from "./ModalBase";
import { formatHoras } from "../utils/reportes";

function ReporteRevisionModal({ loading = false, onClose, onSubmit, reporte }) {
  const [approvedHours, setApprovedHours] = useState(reporte?.approved_hours ?? 0);
  const [reviewerNotes, setReviewerNotes] = useState(reporte?.reviewer_notes ?? "");
  const [errorLocal, setErrorLocal] = useState("");

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
    <ModalBase onClose={onClose} title={`Revisar reporte #${reporte?.id ?? ""}`}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Horas reportadas por el estudiante</p>
          <p className="mt-1">{formatHoras(reporte?.hours_spent ?? 0)}</p>
        </div>

        <label className="flex flex-col gap-2 text-sm">
          Horas aprobadas
          <input
            className="rounded border px-3 py-2"
            min="0"
            onChange={(evento) => setApprovedHours(evento.target.value)}
            step="0.5"
            type="number"
            value={approvedHours}
          />
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

        <p className="text-xs text-slate-500">
          La API calcula el estado automaticamente segun las horas aprobadas.
        </p>

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
