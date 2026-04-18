import { useMemo, useState } from "react";
import ModalAgregarEditar from "../components/ModalAgregarEditar";
import ModalConfirmacion from "../components/ModalConfirmacion";
import { PageShell, PageHero, controlClass, panelBaseClass, primaryButtonClass, secondaryButtonClass } from "../components/PageShell";
import { ListPageSkeleton } from "../components/SkeletonBlocks";
import { useToast } from "../context/ToastContext";
import useAxios from "../hooks/useAxios";

function Cursos() {
  const { setToastMensaje } = useToast();
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);
  const [editarId, setEditarId] = useState(null);
  const [editarCampos, setEditarCampos] = useState(null);
  const [idBorrar, setIdBorrar] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const { data: courses, loading, error, request } = useAxios("/courses/");
  const { request: requestBorrar, loading: loadingBorrar } = useAxios("", { method: "DELETE", auto: false });

  const items = Array.isArray(courses) ? courses : [];

  const filtrados = useMemo(() => {
    const query = busqueda.trim().toLowerCase();
    if (!query) return items;
    return items.filter((curso) =>
      [curso.name, curso.duration, curso.required_service_hours, curso.price].some((valor) =>
        String(valor ?? "").toLowerCase().includes(query),
      ),
    );
  }, [busqueda, items]);

  const handleCerrarAgregar = (actualizar) => {
    setModalAgregar(false);
    if (actualizar) {
      setToastMensaje("Curso creado exitosamente");
      request();
    }
  };

  const handleAbrirEditar = (curso) => {
    setEditarId(curso.id);
    setEditarCampos({
      name: curso.name,
      duration: curso.duration,
      required_service_hours: curso.required_service_hours,
      price: curso.price,
    });
    setModalEditar(true);
  };

  const handleCerrarEditar = (actualizar) => {
    setModalEditar(false);
    setEditarCampos(null);
    setEditarId(null);
    if (actualizar) {
      setToastMensaje("Curso actualizado exitosamente");
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
      setConfirmarBorrar(false);
      await requestBorrar({ url: `/courses/${idBorrar}` });
      setToastMensaje("Curso eliminado exitosamente");
      request();
    } catch (err) {
      console.error("Error al borrar el curso");
    } finally {
      setIdBorrar(null);
    }
  };

  return (
    <PageShell>
      {loading && !courses ? <ListPageSkeleton columns={6} filters={2} rows={6} withStats={false} /> : null}

      <div className={`mx-auto max-w-7xl space-y-6 p-4 sm:p-6 ${loading && !courses ? "hidden" : ""}`}>
        {modalAgregar ? (
          <ModalAgregarEditar
            campos={{ name: "", duration: "", required_service_hours: "", price: "" }}
            cerrar={handleCerrarAgregar}
            url="/courses/"
          />
        ) : null}

        {modalEditar ? (
          <ModalAgregarEditar
            campos={editarCampos}
            cerrar={handleCerrarEditar}
            url={`/courses/${editarId}`}
          />
        ) : null}

        {confirmarBorrar ? (
          <ModalConfirmacion
            mensaje="Estas seguro de que quieres eliminar este curso?"
            onCancel={cancelarBorrar}
            onConfirm={confirmarAccionBorrar}
            titulo="Confirmar eliminacion"
          />
        ) : null}

        <PageHero
          eyebrow="Cursos"
          title="Gestion de cursos"
          description="Mantiene los cursos visibles del sistema con una tabla clara y acciones rapidas."
          actions={(
            <>
              <button className={secondaryButtonClass} onClick={request} type="button">
                Actualizar lista
              </button>
              <button className={primaryButtonClass} onClick={() => setModalAgregar(true)} type="button">
                Agregar curso
              </button>
            </>
          )}
          meta={(
            <div className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-500 shadow-[0_10px_22px_rgba(15,23,42,0.04)]">
              Total: {filtrados.length}
            </div>
          )}
        />

        <section className={`${panelBaseClass} !bg-white`}>
          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Buscar
              <input
                className={controlClass}
                onChange={(evento) => setBusqueda(evento.target.value)}
                placeholder="Nombre, duracion, horas o precio"
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
          <div className="overflow-x-auto">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[0.45fr_1.4fr_0.8fr_0.95fr_0.8fr_0.95fr] gap-4 border-b border-slate-100 bg-slate-50/90 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                <span>ID</span>
                <span>Curso</span>
                <span>Duracion</span>
                <span>Horas requeridas</span>
                <span>Precio</span>
                <span>Accion</span>
              </div>

              {error ? (
                <div className="px-6 py-10 text-sm text-rose-600">Error al cargar los cursos.</div>
              ) : loading ? (
                <div className="px-6 py-10 text-sm text-slate-500">Cargando cursos...</div>
              ) : filtrados.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {filtrados.map((item) => (
                    <div key={item.id} className="grid grid-cols-[0.45fr_1.4fr_0.8fr_0.95fr_0.8fr_0.95fr] items-center gap-4 px-6 py-4 text-sm text-slate-600 transition hover:bg-slate-50/60">
                      <span className="font-semibold text-slate-800">{item.id}</span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">{item.name}</p>
                      </div>
                      <span>{item.duration} meses</span>
                      <span>{item.required_service_hours} horas</span>
                      <span>${item.price}</span>
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
                <div className="px-6 py-10 text-sm text-slate-500">No hay cursos para mostrar.</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default Cursos;
