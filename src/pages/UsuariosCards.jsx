import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import ModalConfirmacion from "../components/ModalConfirmacion";
import Paginacion from "../components/Paginacion";
import {
  PageShell,
  panelBaseClass,
  primaryButtonClass,
} from "../components/PageShell";
import { ListPageSkeleton } from "../components/SkeletonBlocks";
import { useToast } from "../context/ToastContext";

export default function UsuariosCards() {
  const { setToastMensaje } = useToast();
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);
  const [borrandoID, setBorrandoID] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const navigate = useNavigate();

  const { data, loading, error, request } = useAxios("/users/", {
    params: { page, page_size: pageSize },
  });
  const {
    loading: loadingBorrar,
    error: errorBorrar,
    request: requestBorrar,
  } = useAxios("", { method: "DELETE" });

  const usuarios = Array.isArray(data)
    ? data
    : (data?.items ?? data?.results ?? []);
  const total = data?.total ?? usuarios.length ?? 0;
  const adminsEnPagina = usuarios.filter(
    (usuario) => usuario.role === "ADMIN",
  ).length;
  const estudiantesEnPagina = usuarios.filter(
    (usuario) => usuario.role === "STUDENT",
  ).length;

  async function borrarUsuario() {
    try {
      setConfirmarBorrar(false);
      await requestBorrar({ url: `/users/${borrandoID}` });
      setToastMensaje("Usuario eliminado exitosamente");
      request();
    } catch (err) {
      console.error(err);
    } finally {
      setBorrandoID(null);
    }
  }

  return (
    <PageShell>
      {loading && !data ? <ListPageSkeleton columns={5} filters={2} rows={6} /> : null}

      {confirmarBorrar ? (
        <ModalConfirmacion
          mensaje={"Estas segur@ que quieres borrar este usuario?"}
          onCancel={() => {
            setBorrandoID(null);
            setConfirmarBorrar(false);
          }}
          onConfirm={borrarUsuario}
          titulo={"Confirma Borrar"}
        />
      ) : null}

      <div className={`mx-auto max-w-7xl space-y-6 p-4 sm:p-6 ${loading && !data ? "hidden" : ""}`}>
        <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-acc1)]">
              Usuarios
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Gestion de usuarios
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Consulta, crea e identifica rapidamente los registros del sistema.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <button
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:min-w-[180px] sm:w-auto"
              onClick={() => navigate("/usuarios/import")}
              type="button"
            >
              Importar CSV
            </button>
            <button
              className={primaryButtonClass}
              onClick={() => navigate("/usuarios/crear")}
              type="button"
            >
              Crear usuario
            </button>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
          <span>
            <span className="font-semibold text-slate-800">Total:</span> {total}
          </span>
          <span>
            <span className="font-semibold text-slate-800">En pagina:</span>{" "}
            {usuarios.length}
          </span>
          <span>
            <span className="font-semibold text-slate-800">Admins:</span>{" "}
            {adminsEnPagina}
          </span>
          <span>
            <span className="font-semibold text-slate-800">Estudiantes:</span>{" "}
            {estudiantesEnPagina}
          </span>
        </div>

        <section className={`${panelBaseClass} overflow-x-auto !bg-white !p-0`}>
          {loading ? (
            <p className="px-6 py-8 text-sm text-slate-500">
              Cargando usuarios...
            </p>
          ) : null}
          {error ? (
            <p className="px-6 py-8 text-sm text-red-500">{error}</p>
          ) : null}

          {!loading && !error ? (
            <>
              <div className="space-y-4 p-4 2xl:hidden">
                {usuarios.length === 0 ? (
                  <div className="px-2 py-6 text-sm text-slate-500">No hay usuarios.</div>
                ) : (
                  usuarios.map((u) => (
                    <article
                      className="rounded-[1.4rem] border border-slate-100 bg-slate-50/70 p-4"
                      key={u.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {u.first_name} {u.last_name}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">{u.email}</p>
                        </div>
                        <span className="w-fit rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#1958df]">
                          {u.role}
                        </span>
                      </div>

                      <div className="mt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Documento</p>
                        <p className="mt-1 text-sm text-slate-600">{u.document_number || "--"}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          className="inline-flex items-center justify-center rounded-full bg-[#eef5ff] px-4 py-2 text-xs font-semibold text-[#1958df] transition hover:bg-[#e0ecff]"
                          onClick={() => navigate(`/usuarios/${u.id}/editar`)}
                          type="button"
                        >
                          Editar
                        </button>
                        <button
                          className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                          onClick={() => {
                            setBorrandoID(u.id);
                            setConfirmarBorrar(true);
                          }}
                          type="button"
                        >
                          {loadingBorrar && borrandoID === u.id ? "..." : "Eliminar"}
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>

              <div className="hidden min-w-[860px] 2xl:block">
                <div className="grid grid-cols-[1.25fr_1.2fr_0.95fr_0.7fr_0.8fr] gap-4 border-b border-slate-100 bg-slate-50/90 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <span>Nombre</span>
                  <span>Email</span>
                  <span>Documento</span>
                  <span>Rol</span>
                  <span>Accion</span>
                </div>

                {usuarios.length === 0 ? (
                  <div className="px-6 py-10 text-sm text-slate-500">
                    No hay usuarios.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {usuarios.map((u) => (
                      <div
                        key={u.id}
                        className="grid grid-cols-[1.25fr_1.2fr_0.95fr_0.7fr_0.8fr] items-center gap-4 px-6 py-4 text-sm text-slate-600 transition hover:bg-slate-50/60"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800">
                            {u.first_name} {u.last_name}
                          </p>
                        </div>
                        <p className="truncate">{u.email}</p>
                        <p>{u.document_number || "--"}</p>
                        <span className="w-fit rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#1958df]">
                          {u.role}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="inline-flex items-center justify-center rounded-full bg-[#eef5ff] px-4 py-2 text-xs font-semibold text-[#1958df] transition hover:bg-[#e0ecff]"
                            onClick={() => navigate(`/usuarios/${u.id}/editar`)}
                            type="button"
                          >
                            Editar
                          </button>
                          <button
                            className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                            onClick={() => {
                              setBorrandoID(u.id);
                              setConfirmarBorrar(true);
                            }}
                            type="button"
                          >
                            {loadingBorrar && borrandoID === u.id
                              ? "..."
                              : "Eliminar"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </section>

        <Paginacion
          onPageChange={setPage}
          page={page}
          page_size={pageSize}
          total={total}
        />
      </div>
    </PageShell>
  );
}
