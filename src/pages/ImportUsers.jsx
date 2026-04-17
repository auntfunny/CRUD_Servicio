import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell, PageHero, controlClass, panelBaseClass, primaryButtonClass, secondaryButtonClass } from "../components/PageShell";
import useAxios from "../hooks/useAxios";
import { useToast } from "../context/ToastContext";

export default function ImportUsers() {
  const {setToastMensaje} = useToast(); 
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [exporting, setExporting] = useState(false);

  const { loading, request } = useAxios("/users/bulk", {
    method: "POST",
  });
  const { request: requestUsuarios } = useAxios("/users/", {
    auto: false,
    params: { page_size: 100 },
  });

  const handleFileChange = (event) => {
    setFile(event.target.files?.[0] ?? null);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await request({
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const data = await importUsersCSV(file);
      setToastMensaje("Usuarios importados correctemente");
      setResult(data);
    } catch (error) {
      console.error(error);
    }
  };

  const exportToCSV = async () => {
    try {
      setExporting(true);
      let page = 1;
      let allUsers = [];
      let hasMore = true;

      while (hasMore) {
        const response = await requestUsuarios({ params: { page } });
        allUsers = [...allUsers, ...response.items];

        if (allUsers.length >= response.total || response.items.length === 0) {
          hasMore = false;
        } else {
          page += 1;
        }
      }

      const headers = "email,first_name,last_name,document_number,role\n";
      const rows = allUsers
        .map((user) => [
          `"${user.email}"`,
          `"${user.first_name}"`,
          `"${user.last_name}"`,
          `"${user.document_number}"`,
          `"${user.role || "STUDENT"}"`,
        ].join(","))
        .join("\n");

      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "usuarios_exportados.csv";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <PageHero
          eyebrow="Usuarios"
          title="Importar usuarios"
          description="Carga un archivo CSV para registrar usuarios en bloque o exporta la base actual siguiendo el mismo estilo del panel."
          actions={(
            <>
              <button className={secondaryButtonClass} onClick={() => navigate("/usuarios")} type="button">
                Volver a usuarios
              </button>
              <button className={primaryButtonClass} disabled={!file || loading} onClick={handleUpload} type="button">
                {loading ? "Importando..." : "Subir archivo"}
              </button>
            </>
          )}
        />

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <article className={`${panelBaseClass} !bg-white`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Archivo CSV
            </p>
            <div className="mt-5">
              <input
                accept=".csv"
                className="hidden"
                id="csvUpload"
                onChange={handleFileChange}
                type="file"
              />
              <label
                className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-[1.7rem] border border-dashed border-slate-300 bg-slate-50/70 px-6 py-8 text-center transition hover:border-slate-400 hover:bg-white"
                htmlFor="csvUpload"
              >
                <p className="text-base font-semibold text-slate-700">
                  Arrastra tu archivo CSV aqui o haz clic para seleccionarlo
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Usa la estructura de usuarios esperada por el sistema.
                </p>
                {file ? (
                  <div className="mt-5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
                    {file.name}
                  </div>
                ) : null}
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className={primaryButtonClass}
                disabled={!file || loading}
                onClick={handleUpload}
                type="button"
              >
                {loading ? "Importando..." : "Importar usuarios"}
              </button>
              <button
                className={secondaryButtonClass}
                disabled={exporting}
                onClick={exportToCSV}
                type="button"
              >
                {exporting ? "Exportando..." : "Exportar usuarios"}
              </button>
            </div>
          </article>

          <aside className="space-y-6">
            <section className={`${panelBaseClass} !bg-white`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Recomendaciones
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <p>Mantén una fila por usuario y evita duplicar correos institucionales.</p>
                <p>Si el archivo trae datos incompletos, el sistema omitirá esos registros y los mostrará en el resultado.</p>
              </div>
            </section>

            {result ? (
              <section className={`${panelBaseClass} !bg-white`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Resultado
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.3rem] bg-emerald-50/70 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Creados</p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">{result.created}</p>
                  </div>
                  <div className="rounded-[1.3rem] bg-amber-50/70 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Omitidos</p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">{result.skipped}</p>
                  </div>
                </div>

                {result.errors?.length > 0 ? (
                  <div className="mt-5 overflow-hidden rounded-[1.4rem] border border-slate-100">
                    <div className="grid grid-cols-[0.15fr_1fr] gap-4 bg-slate-50/90 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      <span>#</span>
                      <span>Error</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {result.errors.map((item, index) => (
                        <div className="grid grid-cols-[0.15fr_1fr] gap-4 px-5 py-4 text-sm text-slate-600" key={`${item}-${index}`}>
                          <span className="font-semibold text-slate-800">{index + 1}</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}
          </aside>
        </section>
      </div>
    </PageShell>
  );
}
