import { useEffect, useMemo, useState } from "react";
import ArchivoPdfField from "./ArchivoPdfField";
import ModalBase from "./ModalBase";
import {
  buildReporteFormData,
  createReporteFormState,
} from "../utils/reportes";

function ReporteFormModal({
  categorias = [],
  initialData = null,
  loading = false,
  onClose,
  onSubmit,
  title,
}) {
  const [formulario, setFormulario] = useState(createReporteFormState(initialData));
  const [errorLocal, setErrorLocal] = useState("");
  const [errorArchivo, setErrorArchivo] = useState("");

  useEffect(() => {
    setFormulario(createReporteFormState(initialData));
    setErrorArchivo("");
  }, [initialData]);

  const textoBoton = useMemo(() => {
    if (loading) return "Guardando...";
    return initialData ? "Guardar cambios" : "Crear reporte";
  }, [initialData, loading]);

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setFormulario((valorActual) => ({
      ...valorActual,
      [name]: value,
    }));
  };

  const handleArchivoChange = (archivo, errorArchivoNuevo) => {
    setErrorArchivo(errorArchivoNuevo);
    setFormulario((valorActual) => ({
      ...valorActual,
      evidence: archivo,
    }));
  };

  const handleArchivoRemove = () => {
    setErrorArchivo("");
    setFormulario((valorActual) => ({
      ...valorActual,
      evidence: null,
    }));
  };

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    setErrorLocal("");

    if (errorArchivo) {
      return;
    }

    if (!initialData && !formulario.evidence) {
      setErrorLocal("Debes seleccionar un archivo PDF.");
      return;
    }

    try {
      await onSubmit(buildReporteFormData(formulario));
    } catch (error) {
      const mensaje =
        error?.response?.data?.detail?.[0]?.msg ??
        "No se pudo guardar el reporte.";
      setErrorLocal(mensaje);
    }
  };

  return (
    <ModalBase onClose={onClose} title={title}>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5 rounded-[1.7rem] border border-slate-100 bg-white p-5 shadow-[0_16px_32px_rgba(15,23,42,0.04)]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Datos del reporte
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                Registra tus horas de servicio
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Categoria
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 pr-12 outline-none transition focus:border-[var(--color-acc1)] focus:ring-2 focus:ring-[rgba(42,125,225,0.14)]"
                    name="categoryId"
                    onChange={handleChange}
                    required
                    value={formulario.categoryId}
                  >
                    <option value="">Selecciona una categoria</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                    <span className="material-symbols-rounded text-[20px] leading-none">expand_more</span>
                  </span>
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Horas reportadas
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 outline-none transition focus:border-[var(--color-acc1)] focus:ring-2 focus:ring-[rgba(42,125,225,0.14)]"
                  min="0"
                  name="hoursSpent"
                  onChange={handleChange}
                  required
                  step="0.5"
                  type="number"
                  value={formulario.hoursSpent}
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Descripcion de la actividad
              <textarea
                className="min-h-40 rounded-[1.4rem] border border-slate-200 bg-slate-50/70 px-4 py-4 outline-none transition focus:border-[var(--color-acc1)] focus:ring-2 focus:ring-[rgba(42,125,225,0.14)]"
                name="description"
                onChange={handleChange}
                required
                placeholder="Describe de forma clara la actividad realizada."
                value={formulario.description}
              />
            </label>
          </div>

          <div className="space-y-5 rounded-[1.7rem] border border-slate-100 bg-white p-5 shadow-[0_16px_32px_rgba(15,23,42,0.04)]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Evidencia
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                Adjunta tu soporte en PDF
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Usa un archivo claro y legible para facilitar la revision administrativa.
              </p>
            </div>

            <ArchivoPdfField
              archivoActual={formulario.evidence}
              error={errorArchivo}
              nombreArchivoActual={initialData?.evidence_name ?? ""}
              onChange={handleArchivoChange}
              onRemove={handleArchivoRemove}
            />

            <div className="rounded-[1.4rem] bg-[#f6f9ff] p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1958df]">
                  Resumen rapido
                </p>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-800">Categoria:</span>{" "}
                    {categorias.find((categoria) => String(categoria.id) === formulario.categoryId)?.name ?? "Sin seleccionar"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Horas:</span>{" "}
                    {formulario.hoursSpent || 0}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">Archivo:</span>{" "}
                    {formulario.evidence?.name ?? initialData?.evidence_name ?? "Sin archivo"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {errorLocal ? <p className="text-sm text-red-600">{errorLocal}</p> : null}

        <div className="flex flex-wrap justify-end gap-3">
          <button
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="rounded-full bg-[linear-gradient(180deg,_#2f80ed,_#195ec9)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(42,125,225,0.28)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {textoBoton}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

export default ReporteFormModal;
