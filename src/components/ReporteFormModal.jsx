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
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            Categoria
            <select
              className="rounded border px-3 py-2"
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
          </label>

          <label className="flex flex-col gap-2 text-sm">
            Horas reportadas
            <input
              className="rounded border px-3 py-2"
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

        <label className="flex flex-col gap-2 text-sm">
          Descripcion
          <textarea
            className="min-h-28 rounded border px-3 py-2"
            name="description"
            onChange={handleChange}
            required
            value={formulario.description}
          />
        </label>

        <ArchivoPdfField
          archivoActual={formulario.evidence}
          error={errorArchivo}
          nombreArchivoActual={initialData?.evidence_name ?? ""}
          onChange={handleArchivoChange}
          onRemove={handleArchivoRemove}
        />

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
            {textoBoton}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}

export default ReporteFormModal;
