import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalBase from "../components/ModalBase";
import {
  PageHero,
  PageShell,
  panelBaseClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../components/PageShell";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import useAxios from "../hooks/useAxios";

function PasswordConfirmModal({
  loading = false,
  onCancel,
  onConfirm,
  password,
  setPassword,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ModalBase
      onClose={onCancel}
      title="Confirmar exportacion"
      widthClass="max-w-lg"
      zClass="z-[70]"
    >
      <div className="space-y-5">
        <p className="text-sm leading-6 text-slate-600">
          Ingresa tu contrasena para descargar el archivo con datos de usuarios.
        </p>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Contrasena actual
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-1.5 focus-within:border-[var(--color-acc1)] focus-within:ring-2 focus-within:ring-[rgba(42,125,225,0.14)]">
            <input
              autoFocus
              className="min-w-0 flex-1 bg-transparent py-3 outline-none"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Escribe tu contrasena"
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-[var(--color-acc1)]"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              <span className="material-symbols-rounded text-[20px] leading-none">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </label>

        <div className="flex justify-end gap-3">
          <button
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="rounded-full bg-[linear-gradient(180deg,#2f80ed,#195ec9)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(42,125,225,0.28)] transition hover:brightness-95 disabled:opacity-60"
            disabled={!password.trim() || loading}
            onClick={onConfirm}
            type="button"
          >
            {loading ? "Verificando..." : "Descargar CSV"}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}

function InfoTooltip() {
  return (
    <div className="group relative inline-flex items-center justify-center">
      <button
        aria-label="Ver ayuda"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
        type="button"
      >
        ?
      </button>

      <div className="pointer-events-none absolute left-1/2 top-[calc(100%+0.75rem)] z-20 w-64 -translate-x-1/2 rounded-[1.2rem] border border-slate-200 bg-white px-4 py-4 text-center text-sm leading-6 text-slate-600 opacity-0 shadow-[0_20px_40px_rgba(15,23,42,0.12)] transition duration-200 group-hover:opacity-100">
        <p>Arrastra o selecciona el archivo .csv de los usuarios, eso los traera.</p>
      </div>
    </div>
  );
}

export default function ImportUsers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setToastMensaje } = useToast();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");

  const { loading, request } = useAxios("/users/bulk", {
    method: "POST",
  });
  const { request: requestUsuarios } = useAxios("/users/", {
    auto: false,
    params: { page_size: 100 },
  });
  const {
    loading: checkingPassword,
    request: verifyPassword,
  } = useAxios("/auth/login", {
    auto: false,
    method: "POST",
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
      setResult(response.data);
      setToastMensaje("Usuarios importados correctamente");
    } catch (error) {
      console.error(error);
    }
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPassword("");
  };

  const exportToCSV = async () => {
    try {
      await verifyPassword({
        body: {
          email: user?.email,
          password: password,
        },
      });

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
        .map((currentUser) => [
          `"${currentUser.email}"`,
          `"${currentUser.first_name}"`,
          `"${currentUser.last_name}"`,
          `"${currentUser.document_number}"`,
          `"${currentUser.role || "STUDENT"}"`,
        ].join(","))
        .join("\n");

      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "usuarios_exportados.csv";
      link.click();
      window.URL.revokeObjectURL(url);

      setToastMensaje("Exportacion completada");
      closePasswordModal();
    } catch (error) {
      setToastMensaje("Contrasena incorrecta. No se pudo exportar el archivo.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageShell>
      {isPasswordModalOpen ? (
        <PasswordConfirmModal
          loading={checkingPassword || exporting}
          onCancel={closePasswordModal}
          onConfirm={exportToCSV}
          password={password}
          setPassword={setPassword}
        />
      ) : null}

      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <PageHero
          eyebrow="Usuarios"
          title="Importar usuarios"
          description="Sube un archivo CSV o descarga la lista actual."
          actions={(
            <>
              <button className={secondaryButtonClass} onClick={() => navigate("/usuarios")} type="button">
                Volver a usuarios
              </button>
            </>
          )}
        />

        <section className={`grid gap-6 ${result ? "xl:grid-cols-[1.15fr_0.85fr]" : ""}`}>
          <article className={`${panelBaseClass} !bg-white`}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Archivo CSV
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-medium text-slate-500">Ayuda</span>
                <InfoTooltip />
              </div>
            </div>

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
                  Revisa que el archivo sea seguro antes de subirlo, nos ayudas a protegernos.
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
                onClick={() => setIsPasswordModalOpen(true)}
                type="button"
              >
                {exporting ? "Exportando..." : "Exportar usuarios"}
              </button>
            </div>
          </article>

          {result ? (
            <aside className="mx-auto w-full max-w-xl">
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
            </aside>
          ) : null}
        </section>
      </div>
    </PageShell>
  );
}
