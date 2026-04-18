import { useState } from "react";
import useAxios from "../hooks/useAxios";
import ModalAgregarEditar from "../components/ModalAgregarEditar";
import ModalConfirmacion from "../components/ModalConfirmacion";
import { PageShell, panelBaseClass, primaryButtonClass } from "../components/PageShell";
import { ListPageSkeleton } from "../components/SkeletonBlocks";
import { useToast } from "../context/ToastContext";

const Categorias = () => {
  const {setToastMensaje} = useToast();
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [editarCampos, setEditarCampos] = useState(null);
  const [editarId, setEditarId] = useState(null);
  const [idBorrar, setIdBorrar] = useState(null);
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);
  const { data, loading, error, request } = useAxios("/categories/");
  const { loading: loadingBorrar, request: requestBorrar } = useAxios("", { method: "DELETE" });

  const categorias = Array.isArray(data) ? data : data?.items ?? data?.results ?? [];
  const totalCategorias = categorias.length;
  const categoriasConDescripcion = categorias.filter((item) => item.description)?.length ?? 0;
  const ultimaCategoria = categorias[categorias.length - 1]?.name ?? "--";

  const borrarCategoria = async () => {
    try {
      setConfirmarBorrar(false);
      await requestBorrar({ url: `/categories/${idBorrar}` });
      setToastMensaje("Categoría eliminado exitosamente");
      request();
    } catch (err) {
      console.error(err);
    } finally {
      setIdBorrar(null);
    }
  };

  return (
    <PageShell>
      {loading && !data ? <ListPageSkeleton columns={5} filters={1} rows={6} /> : null}

      {modalAgregar ? (
        <ModalAgregarEditar
          campos={{ name: "", description: "" }}
          cerrar={(actualizar) => {
            setModalAgregar(false);
            if (actualizar) {
              setToastMensaje("Categoria creada exitosamente");
              request();
            }
          }}
          existingNames={categorias.map((item) => ({ id: item.id, name: item.name }))}
          url={"/categories/"}
        />
      ) : null}
      {modalEditar ? (
        <ModalAgregarEditar
          campos={editarCampos}
          cerrar={(actualizar) => {
            setModalEditar(false);
            setEditarCampos(null);
            setEditarId(null);
            if (actualizar) {
              setToastMensaje("Categoria actualizada exitosamente");
              request();
            }
          }}
          currentItemId={editarId}
          existingNames={categorias.map((item) => ({ id: item.id, name: item.name }))}
          url={`/categories/${editarId}`}
        />
      ) : null}
      {confirmarBorrar ? (
        <ModalConfirmacion
          mensaje={"Estas segur@ que quieres borrar esta categoria?"}
          onCancel={() => {
            setIdBorrar(null);
            setConfirmarBorrar(false);
          }}
          onConfirm={borrarCategoria}
          titulo={"Confirma Borrar"}
        />
      ) : null}

      <div className={`mx-auto max-w-7xl space-y-6 p-4 sm:p-6 ${loading && !data ? "hidden" : ""}`}>
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-acc1)]">Categorias</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">Gestion de categorias</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Organiza y administra las categorias del sistema desde una lista mas clara.
            </p>
          </div>

          <button className={primaryButtonClass} onClick={() => setModalAgregar(true)} type="button">
            Crear categoria
          </button>
        </section>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
          <span><span className="font-semibold text-slate-800">Total:</span> {totalCategorias}</span>
          <span><span className="font-semibold text-slate-800">Con descripcion:</span> {categoriasConDescripcion}</span>
          <span><span className="font-semibold text-slate-800">Ultima:</span> {ultimaCategoria}</span>
          <span><span className="font-semibold text-slate-800">Modo:</span> Manual</span>
        </div>

        <section className={`${panelBaseClass} overflow-x-auto !bg-white !p-0`}>
          {error ? <p className="px-6 py-8 text-sm text-red-500">Error en cargar las categorias</p> : null}
          {loading ? <p className="px-6 py-8 text-sm text-slate-500">Cargando categorias...</p> : null}

          {!loading && !error ? (
            <div className="min-w-[820px]">
              <div className="grid grid-cols-[0.65fr_1fr_1.8fr_0.8fr_0.9fr] gap-4 border-b border-slate-100 bg-slate-50/90 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                <span>ID</span>
                <span>Nombre</span>
                <span>Descripcion</span>
                <span>Creado</span>
                <span>Accion</span>
              </div>

              {categorias.length === 0 ? (
                <div className="px-6 py-10 text-sm text-slate-500">No hay categorias.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {categorias.map((category) => (
                    <div key={category.id} className="grid grid-cols-[0.65fr_1fr_1.8fr_0.8fr_0.9fr] items-center gap-4 px-6 py-4 text-sm text-slate-600 transition hover:bg-slate-50/60">
                      <p className="font-semibold text-slate-800">#{category.id}</p>
                      <p className="truncate font-medium text-slate-800">{category.name}</p>
                      <p className="truncate">{category.description || "Sin descripcion registrada."}</p>
                      <p>{category.created_at?.split("T")[0] ?? "--"}</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="inline-flex items-center justify-center rounded-full bg-[#eef5ff] px-4 py-2 text-xs font-semibold text-[#1958df] transition hover:bg-[#e0ecff]"
                          onClick={() => {
                            setEditarCampos({ name: category.name, description: category.description });
                            setEditarId(category.id);
                            setModalEditar(true);
                          }}
                          type="button"
                        >
                          Editar
                        </button>
                        <button
                          className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                          onClick={() => {
                            setIdBorrar(category.id);
                            setConfirmarBorrar(true);
                          }}
                          type="button"
                        >
                          {loadingBorrar && idBorrar === category.id ? "..." : "Borrar"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </section>
      </div>
    </PageShell>
  );
};

export default Categorias;
