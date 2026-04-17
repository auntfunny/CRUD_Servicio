import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import ModalConfirmacion from "../components/ModalConfirmacion";
import Paginacion from "../components/Paginacion";
import { PageShell, panelBaseClass, primaryButtonClass } from "../components/PageShell";

export default function UsuariosCards() {
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);
  const [borrandoID, setBorrandoID] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const navigate = useNavigate();

  const { data, loading, error, request } = useAxios("/users/", {
    params: { page, page_size: pageSize },
  });
  const { loading: loadingBorrar, request: requestBorrar } = useAxios("", { method: "DELETE" });

  const usuarios = data?.items ?? [];
  const total = data?.total ?? 0;
  const adminsEnPagina = usuarios.filter((usuario) => usuario.role === "ADMIN").length;
  const estudiantesEnPagina = usuarios.filter((usuario) => usuario.role === "STUDENT").length;

  async function borrarUsuario() {
    try {
      setConfirmarBorrar(false);
      await requestBorrar({ url: `/users/${borrandoID}` });
      request();
    } catch (err) {
      console.error(err);
    } finally {
      setBorrandoID(null);
    }
  }

  return (
    <PageShell>
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

      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-acc1)]">Usuarios</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">Gestion de usuarios</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Consulta, crea e identifica rapidamente los registros del sistema.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
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
          <span><span className="font-semibold text-slate-800">Total:</span> {total}</span>
          <span><span className="font-semibold text-slate-800">En pagina:</span> {usuarios.length}</span>
          <span><span className="font-semibold text-slate-800">Admins:</span> {adminsEnPagina}</span>
          <span><span className="font-semibold text-slate-800">Estudiantes:</span> {estudiantesEnPagina}</span>
        </div>

        <section className={`${panelBaseClass} overflow-x-auto !bg-white !p-0`}>
          {loading ? <p className="px-6 py-8 text-sm text-slate-500">Cargando usuarios...</p> : null}
          {error ? <p className="px-6 py-8 text-sm text-red-500">{error}</p> : null}

          {!loading && !error ? (
            <div className="min-w-[860px]">
              <div className="grid grid-cols-[1.25fr_1.2fr_0.95fr_0.7fr_0.8fr] gap-4 border-b border-slate-100 bg-slate-50/90 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                <span>Nombre</span>
                <span>Email</span>
                <span>Documento</span>
                <span>Rol</span>
                <span>Accion</span>
              </div>

              {usuarios.length === 0 ? (
                <div className="px-6 py-10 text-sm text-slate-500">No hay usuarios.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {usuarios.map((u) => (
                    <div key={u.id} className="grid grid-cols-[1.25fr_1.2fr_0.95fr_0.7fr_0.8fr] items-center gap-4 px-6 py-4 text-sm text-slate-600 transition hover:bg-slate-50/60">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">{u.first_name} {u.last_name}</p>
                      </div>
                      <p className="truncate">{u.email}</p>
                      <p>{u.document_number || "--"}</p>
                      <span className="w-fit rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#1958df]">{u.role}</span>
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
                          {loadingBorrar && borrandoID === u.id ? "..." : "Eliminar"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </section>

        <Paginacion onPageChange={setPage} page={page} page_size={pageSize} total={total} />
      </div>
    </PageShell>
  );
}
