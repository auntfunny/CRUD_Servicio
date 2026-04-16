import { useState } from "react";

function ArchivoPdfField({
  archivoActual = null,
  error = "",
  nombreArchivoActual = "",
  onChange,
  onRemove,
}) {
  const [arrastrando, setArrastrando] = useState(false);
  const nombreVisible = archivoActual?.name || nombreArchivoActual;

  const procesarArchivo = (archivo) => {
    if (!archivo) {
      onChange(null, "");
      return;
    }

    const extensionValida = archivo.name.toLowerCase().endsWith(".pdf");
    const mimeValido = archivo.type === "application/pdf" || archivo.type === "";

    if (!extensionValida || !mimeValido) {
      onChange(null, "Solo se permite subir archivos PDF.");
      return;
    }

    onChange(archivo, "");
  };

  const handleChange = (evento) => {
    procesarArchivo(evento.target.files?.[0] ?? null);
    evento.target.value = "";
  };

  const handleDragOver = (evento) => {
    evento.preventDefault();
    setArrastrando(true);
  };

  const handleDragLeave = (evento) => {
    evento.preventDefault();
    setArrastrando(false);
  };

  const handleDrop = (evento) => {
    evento.preventDefault();
    setArrastrando(false);
    procesarArchivo(evento.dataTransfer?.files?.[0] ?? null);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 text-sm">
        <span>Archivo PDF</span>
        <input
          accept="application/pdf,.pdf"
          className="hidden"
          id="archivo-pdf"
          onChange={handleChange}
          type="file"
        />
        <label
          className={`flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-6 text-center transition ${
            arrastrando
              ? "border-slate-900 bg-slate-100"
              : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-white"
          }`}
          htmlFor="archivo-pdf"
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p className="text-sm font-semibold text-slate-700">
            Arrastra tu PDF aqui o haz clic para seleccionarlo
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Solo se permiten archivos .pdf
          </p>
        </label>
      </div>

      {nombreVisible ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Archivo seleccionado
            </p>
            <p className="mt-1 text-sm text-slate-700">{nombreVisible}</p>
          </div>

          <button
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
            onClick={onRemove}
            type="button"
          >
            Eliminar
          </button>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

export default ArchivoPdfField;
