import { useMemo, useState } from "react";
import usePaginacionApi from "../hooks/usePaginacionApi";

const estilosTarjeta = [
  "from-[#dbeafe] to-white border-[#bfdbfe]",
  "from-[#dcfce7] to-white border-[#bbf7d0]",
  "from-[#fef3c7] to-white border-[#fde68a]",
  "from-[#fce7f3] to-white border-[#fbcfe8]",
  "from-[#ede9fe] to-white border-[#ddd6fe]",
  "from-[#e0f2fe] to-white border-[#bae6fd]",
];

function obtenerEstiloTarjeta(id, indice) {
  const base = typeof id === "number" ? id : indice;
  return estilosTarjeta[base % estilosTarjeta.length];
}

function TarjetaReporte({ indice, reporte }) {
  const estilo = obtenerEstiloTarjeta(reporte.id, indice);
  const nombreEstudiante = reporte.student?.full_name ?? "Estudiante no disponible";
  const nombreCategoria = reporte.category?.name ?? "Sin categoria";
  const horasAprobadas = reporte.approved_hours ?? 0;

  return (
    <article
      className={`rounded-3xl border bg-gradient-to-br ${estilo} p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.28em] text-acc2/50">
            Reporte #{reporte.id}
          </p>
          <h3 className="mt-3 font-avenir text-2xl font-semibold text-acc2">
            {nombreEstudiante}
          </h3>
        </div>

        <span className="rounded-full bg-white/80 px-3 py-1 font-montserrat text-xs font-semibold text-acc1 shadow-sm">
          {reporte.status}
        </span>
      </div>

      <div className="mt-5 space-y-3 font-montserrat text-sm text-acc2/75">
        <p>
          <span className="font-semibold text-acc2">Categoria:</span> {nombreCategoria}
        </p>
        <p>
          <span className="font-semibold text-acc2">Horas reportadas:</span> {reporte.hours_spent}
        </p>
        <p>
          <span className="font-semibold text-acc2">Horas aprobadas:</span> {horasAprobadas}
        </p>
        <p className="line-clamp-3">
          <span className="font-semibold text-acc2">Descripcion:</span> {reporte.description}
        </p>
      </div>
    </article>
  );
}

function DemoPaginacion() {
  const [estado, setEstado] = useState("");
  const {
    items,
    pagina,
    tamanoPagina,
    total,
    totalPaginas,
    cargando,
    error,
    cambiarPagina,
    cambiarTamanoPagina,
    paginaAnterior,
    paginaSiguiente,
    actualizarParametros,
  } = usePaginacionApi("/reports/", {
    paginaInicial: 1,
    tamanoInicial: 6,
  });

  const mensajeError = useMemo(() => {
    if (!error) return "";
    return error.response?.data?.detail?.[0]?.msg ?? "No se pudo cargar la informacion.";
  }, [error]);

  const manejarCambioEstado = (evento) => {
    const valor = evento.target.value;
    setEstado(valor);
    actualizarParametros({ status: valor });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(42,125,225,0.12)_0%,_#ffffff_48%)] px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl rounded-[32px] border border-acc1/15 bg-white p-6 shadow-[0_20px_80px_rgba(0,55,100,0.08)] sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 border-b border-acc1/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.32em] text-acc1">
              Demo
            </p>
            <h1 className="mt-3 font-avenir text-4xl font-semibold text-acc2">
              Paginacion con API
            </h1>
            <p className="mt-4 max-w-2xl font-montserrat text-sm leading-7 text-acc2/70">
              Esta pagina usa el hook <code>usePaginacionApi</code> para consumir la API
              real con <code>page</code> y <code>page_size</code>.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <label className="flex flex-col gap-2 font-montserrat text-sm text-acc2">
              Estado
              <select
                className="rounded-2xl border border-acc1/20 bg-white px-4 py-3 outline-none focus:border-acc1"
                onChange={manejarCambioEstado}
                value={estado}
              >
                <option value="">Todos</option>
                <option value="PENDING">PENDING</option>
                <option value="APPROVED_FULL">APPROVED_FULL</option>
                <option value="APPROVED_PARTIAL">APPROVED_PARTIAL</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 font-montserrat text-sm text-acc2">
              Tarjetas por pagina
              <select
                className="rounded-2xl border border-acc1/20 bg-white px-4 py-3 outline-none focus:border-acc1"
                onChange={(evento) => cambiarTamanoPagina(evento.target.value)}
                value={tamanoPagina}
              >
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 font-montserrat text-sm text-acc2/75">
          <span className="rounded-full bg-acc1/10 px-4 py-2">
            Total de registros: <strong>{total}</strong>
          </span>
          <span className="rounded-full bg-acc2/8 px-4 py-2">
            Pagina actual: <strong>{pagina}</strong>
          </span>
          <span className="rounded-full bg-acc3/15 px-4 py-2">
            Total de paginas: <strong>{totalPaginas}</strong>
          </span>
        </div>

        {cargando ? (
          <div className="grid gap-5 pt-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: tamanoPagina }).map((_, indice) => (
              <div
                key={indice}
                className="h-56 animate-pulse rounded-3xl border border-acc1/10 bg-acc1/8"
              />
            ))}
          </div>
        ) : null}

        {!cargando && error ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 font-montserrat text-sm text-red-700">
            {mensajeError}
          </div>
        ) : null}

        {!cargando && !error ? (
          <div className="grid gap-5 pt-8 md:grid-cols-2 xl:grid-cols-3">
            {items.map((reporte, indice) => (
              <TarjetaReporte key={reporte.id} indice={indice} reporte={reporte} />
            ))}
          </div>
        ) : null}

        {!cargando && !error && items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-acc1/15 bg-acc1/5 px-5 py-4 font-montserrat text-sm text-acc2/75">
            No hay resultados para los filtros actuales.
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-4 border-t border-acc1/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-montserrat text-sm text-acc2/70">
            Mostrando pagina {pagina} de {totalPaginas}.
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-full border border-acc1/20 px-5 py-3 font-montserrat text-sm font-semibold text-acc2 transition hover:border-acc1 hover:text-acc1 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={pagina <= 1 || cargando}
              onClick={paginaAnterior}
              type="button"
            >
              Anterior
            </button>

            {Array.from({ length: totalPaginas }).slice(0, 6).map((_, indice) => {
              const numeroPagina = indice + 1;
              const activa = numeroPagina === pagina;

              return (
                <button
                  key={numeroPagina}
                  className={`h-12 w-12 rounded-full font-montserrat text-sm font-semibold transition ${
                    activa
                      ? "bg-acc1 text-white shadow-lg"
                      : "border border-acc1/20 text-acc2 hover:border-acc1 hover:text-acc1"
                  }`}
                  onClick={() => cambiarPagina(numeroPagina)}
                  type="button"
                >
                  {numeroPagina}
                </button>
              );
            })}

            <button
              className="rounded-full border border-acc1/20 px-5 py-3 font-montserrat text-sm font-semibold text-acc2 transition hover:border-acc1 hover:text-acc1 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={pagina >= totalPaginas || cargando}
              onClick={paginaSiguiente}
              type="button"
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DemoPaginacion;
