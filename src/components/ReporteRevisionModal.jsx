import { useState } from "react";
import ModalBase from "./ModalBase";

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
          Nota de revision
          <textarea
            className="min-h-28 rounded border px-3 py-2"
            onChange={(evento) => setReviewerNotes(evento.target.value)}
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
