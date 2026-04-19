import { useMemo, useState } from "react";
import ModalAgregarEditar from "../components/ModalAgregarEditar";
import ModalConfirmacion from "../components/ModalConfirmacion";
import {
  PageShell,
  PageHero,
  controlClass,
  panelBaseClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "../components/PageShell";
import { ListPageSkeleton } from "../components/SkeletonBlocks";
import useAxios from "../hooks/useAxios";
import { useToast } from "../context/ToastContext";

function PaisesAdmin() {
  const {setToastMensaje} = useToast();
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);
  const [editarId, setEditarId] = useState(null);
  const [editarCampos, setEditarCampos] = useState(null);
  const [idBorrar, setIdBorrar] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const { data: countries, loading, error, request } = useAxios("/countries/");
  const { request: requestBorrar, loading: loadingBorrar } = useAxios("", {
    method: "DELETE",
    auto: false,
  });

  const items = useMemo(
    () => (Array.isArray(countries) ? countries : []),
    [countries],
  );

  const filtrados = useMemo(() => {
    const query = busqueda.trim().toLowerCase();
    if (!query) return items;
    return items.filter((pais) =>
      [pais.name, pais.code].some((valor) =>
        String(valor ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [busqueda, items]);

  const handleCerrarAgregar = (actualizar) => {
    setModalAgregar(false);
    if (actualizar){
      setToastMensaje("País creado exitosamente");
      request();
    } 
      
  };

  const handleAbrirEditar = (pais) => {
    setEditarId(pais.id);
    setEditarCampos({ name: pais.name, code: pais.code });
    setModalEditar(true);
  };

  const handleCerrarEditar = (actualizar) => {
    setModalEditar(false);
    setEditarCampos(null);
    setEditarId(null);
    if (actualizar) {
      setToastMensaje("País editado exitosamente");
      request();
    }
  };

  const handleAbrirBorrar = (id) => {
    setIdBorrar(id);
    setConfirmarBorrar(true);
  };

  const cancelarBorrar = () => {
    setIdBorrar(null);
    setConfirmarBorrar(false);
  };

  const confirmarAccionBorrar = async () => {
    try {
      await requestBorrar({ url: `/countries/${idBorrar}` });
      setConfirmarBorrar(false);
      setIdBorrar(null);
      setToastMensaje("País eliminado exitosamente");
      request();
    } catch (err) {
      console.error("Error al borrar el pais");
    }
  };

  return (
    <PageShell>
      {loading && !countries ? <ListPageSkeleton columns={5} filters={2} rows={6} withStats={false} /> : null}

      <div className={`mx-auto max-w-7xl space-y-6 p-4 sm:p-6 ${loading && !countries ? "hidden" : ""}`}>
        {modalAgregar ? (
          <ModalAgregarEditar
            campos={{ name: "", code: "" }}
            cerrar={handleCerrarAgregar}
            url="/countries/"
          />
        ) : null}

        {modalEditar ? (
          <ModalAgregarEditar
            campos={editarCampos}
            cerrar={handleCerrarEditar}
            metodo="PATCH"
            url={`/countries/${editarId}`}
          />
        ) : null}

        {confirmarBorrar ? (
          <ModalConfirmacion
            mensaje="Estas seguro de que quieres eliminar este pais?"
            onCancel={cancelarBorrar}
            onConfirm={confirmarAccionBorrar}
            titulo="Confirmar eliminacion"
          />
        ) : null}

        <PageHero
          eyebrow="Paises"
          title="Gestion de paises"
          description="Administra los paises disponibles con el mismo formato limpio y operativo del resto del panel."
          actions={
            <>
              <button
                className={secondaryButtonClass}
                onClick={request}
                type="button"
              >
                Actualizar lista
              </button>
              <button
                className={primaryButtonClass}
                onClick={() => setModalAgregar(true)}
                type="button"
              >
                Agregar pais
              </button>
            </>
          }
          meta={
            <div className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-500 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
              Total: {filtrados.length}
            </div>
          }
        />

        <section className={`${panelBaseClass} !bg-white`}>
          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Buscar
              <input
                className={controlClass}
                onChange={(evento) => setBusqueda(evento.target.value)}
                placeholder="Nombre o codigo"
                value={busqueda}
              />
            </label>

            <div className="flex items-end">
              <div className="w-full rounded-[1.3rem] bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
                {filtrados.length} registros visibles
              </div>
            </div>
          </div>
        </section>

        <section className={`${panelBaseClass} !bg-white overflow-hidden p-0`}>

          {/* Vista Tabla */}
          <div className="hidden overflow-x-auto md:block">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[0.5fr_1.4fr_0.8fr_0.9fr_0.95fr] gap-4 border-b border-slate-100 bg-slate-50/90 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                <span>ID</span>
                <span>Pais</span>
                <span>Codigo</span>
                <span>Creado</span>
                <span>Accion</span>
              </div>

              {error ? (
                <div className="px-6 py-10 text-sm text-rose-600">
                  Error al cargar los paises.
                </div>
              ) : loading ? (
                <div className="px-6 py-10 text-sm text-slate-500">
                  Cargando paises...
                </div>
              ) : filtrados.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {filtrados.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[0.5fr_1.4fr_0.8fr_0.9fr_0.95fr] items-center gap-4 px-6 py-4 text-sm text-slate-600 transition hover:bg-slate-50/60"
                    >
                      <span className="font-semibold text-slate-800">
                        {item.id}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">
                          {item.name}
                        </p>
                      </div>
                      <span className="font-medium uppercase text-slate-700">
                        {item.code}
                      </span>
                      <span>{item.created_at?.split("T")[0] ?? "--"}</span>
                      <div className="flex items-center gap-2">
                        <button
                          className="inline-flex items-center justify-center rounded-full bg-[#eef5ff] px-4 py-2 text-xs font-semibold text-[#1958df] transition hover:bg-[#e0ecff]"
                          onClick={() => handleAbrirEditar(item)}
                          type="button"
                        >
                          Editar
                        </button>
                        <button
                          className="inline-flex items-center justify-center rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                          disabled={loadingBorrar && idBorrar === item.id}
                          onClick={() => handleAbrirBorrar(item.id)}
                          type="button"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-10 text-sm text-slate-500">
                  No hay paises para mostrar.
                </div>
              )}
            </div>
          </div>

          {/* Vista Tarjetas */}
          <div className="space-y-3 p-4 md:hidden">
            {error ? (
              <div className="text-sm text-rose-600">Error al cargar los paises.</div>
            ) : loading ? (
              <div className="text-sm text-slate-500">Cargando paises...</div>
            ) : filtrados.length > 0 ? (
              filtrados.map((item) => (
                <div key={item.id} className="rounded-[1.4rem] border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        ID: {item.id}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Codigo</p>
                    <p className="mt-1 text-sm font-medium uppercase text-slate-700">
                      {item.code}
                    </p>
                  </div>

                  <div className="mt-3 text-xs text-slate-400">
                    Creado: {item.created_at?.split("T")[0] ?? "--"}
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      className="w-full inline-flex items-center justify-center rounded-full bg-[#eef5ff] px-4 py-2 text-xs font-semibold text-[#1958df] transition hover:bg-[#e0ecff]"
                      onClick={() => handleAbrirEditar(item)}
                      type="button"
                    >
                      Editar
                    </button>
                    <button
                      className="w-full inline-flex items-center justify-center rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      disabled={loadingBorrar && idBorrar === item.id}
                      onClick={() => handleAbrirBorrar(item.id)}
                      type="button"
                    >
                      {loadingBorrar && idBorrar === item.id ? "..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">No hay paises para mostrar.</div>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default PaisesAdmin;
