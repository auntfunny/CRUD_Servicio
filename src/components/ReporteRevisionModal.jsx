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
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">
            Horas reportadas por el estudiante {reporte?.student?.full_name ?? "Sin dato"}
          </p>
          <p className="mt-1">{formatHoras(reporte?.hours_spent ?? 0)}</p>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Horas aprobadas</span>
          <span className="relative block">
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 pr-24 outline-none transition focus:border-[var(--color-acc1)] focus:ring-2 focus:ring-[rgba(42,125,225,0.14)]"
              min="0"
              onChange={(evento) => setApprovedHours(evento.target.value)}
              step="0.5"
              type="number"
              value={approvedHours}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
              onClick={() => setApprovedHours(horasReportadas)}
              type="button"
            >
              Usar todas
            </button>
          </span>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Comentario para el estudiante
          <textarea
            className="min-h-32 rounded-[1.4rem] border border-slate-200 bg-slate-50/70 px-4 py-4 outline-none transition focus:border-[var(--color-acc1)] focus:ring-2 focus:ring-[rgba(42,125,225,0.14)]"
            onChange={(evento) => setReviewerNotes(evento.target.value)}
            placeholder="Explica que estuvo bien o que debe corregir."
            value={reviewerNotes}
          />
        </label>

        {errorLocal ? <p className="text-sm text-red-600">{errorLocal}</p> : null}

        <div className="flex justify-end gap-3">
          <button
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="rounded-full bg-[linear-gradient(180deg,_#2f80ed,_#195ec9)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(42,125,225,0.28)] transition hover:brightness-95"
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
