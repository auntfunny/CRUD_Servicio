import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BadgeEstadoReporte from "../components/BadgeEstadoReporte";
import Paginacion from "../components/Paginacion";
import ReporteDetalleModal from "../components/ReporteDetalleModal";
import ReporteRevisionModal from "../components/ReporteRevisionModal";
import TarjetaEstadistica from "../components/TarjetaEstadistica";
import {
  PageShell,
  controlClass,
  panelBaseClass,
  primaryButtonClass,
} from "../components/PageShell";
import { FiltersSkeleton, StatsGridSkeleton, TableSkeleton } from "../components/SkeletonBlocks";
import useAxios from "../hooks/useAxios";
import {
  estadoOptions,
  getFechaOrdenable,
  formatFecha,
  formatHoras,
} from "../utils/reportes";
import { useToast } from "../context/ToastContext";

function ReportesAdmin() {
  const { setToastMensaje } = useToast();
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [busquedaAplicada, setBusquedaAplicada] = useState("");
  const [ordenActual, setOrdenActual] = useState("fecha-desc");
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [reporteRevisando, setReporteRevisando] = useState(null);
  const [reportesBusqueda, setReportesBusqueda] = useState([]);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState(null);

  const paramsConsulta = useMemo(() => {
    const params = {
      page: page,
      page_size: pageSize,
    };

    if (estadoFiltro) params.status = estadoFiltro;
    if (categoriaFiltro) params.category_id = categoriaFiltro;
    if (busqueda.trim()) params.search = busqueda.trim();

    return params;
  }, [busqueda, categoriaFiltro, estadoFiltro, page, pageSize]);

  const {
    data,
    error,
    loading,
    request: recargarReportes,
  } = useAxios("/reports/", {
    params: paramsConsulta,
  });
  const { request: consultarReportes } = useAxios("/reports/", {
    auto: false,
  });
  const { loading: guardandoRevision, request: actualizarReporte } = useAxios(
    "/reports/",
    {
      auto: false,
      method: "PATCH",
    },
  );
  const { data: categoriasData } = useAxios("/categories/");
  const { data: dashboardData } = useAxios("/dashboard/stats");

  const reportes = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data)
          ? data
          : [];
  const categorias = Array.isArray(categoriasData?.items)
    ? categoriasData.items
    : Array.isArray(categoriasData?.data)
      ? categoriasData.data
      : Array.isArray(categoriasData?.results)
        ? categoriasData.results
        : Array.isArray(categoriasData)
          ? categoriasData
          : [];
  const mensajeError =
    errorBusqueda?.response?.data?.detail?.[0]?.msg ??
    error?.response?.data?.detail?.[0]?.msg ??
    "No se pudieron cargar los reportes.";

  const textoBusqueda = busquedaAplicada.trim().toLowerCase();
  const usarColeccionCompleta = Boolean(estadoFiltro || categoriaFiltro || textoBusqueda);
  const reportesFuente = usarColeccionCompleta ? reportesBusqueda : reportes;

  const reportesFiltrados = useMemo(() => {
    return reportesFuente.filter((reporte) => {
      if (!textoBusqueda) return true;

      const valoresBusqueda = [
        reporte.id,
        reporte.description,
        reporte.category?.name,
        reporte.student?.full_name,
      ]
        .filter(Boolean)
        .map((valor) => String(valor).toLowerCase());

      return valoresBusqueda.some((valor) => valor.includes(textoBusqueda));
    });
  }, [reportesFuente, textoBusqueda]);

  const total = busqueda.trim()
    ? reportesFiltrados.length
    : usarColeccionCompleta
      ? reportesFiltrados.length
    : (data?.total ?? reportes.length);

  const reportesOrdenados = useMemo(() => {
    const lista = [...reportesFiltrados];

    return lista.sort((reporteA, reporteB) => {
      if (ordenActual === "estudiante-asc") {
        return (reporteA.student?.full_name ?? "").localeCompare(
          reporteB.student?.full_name ?? "",
        );
      }

      if (ordenActual === "horas-desc" || ordenActual === "horas-asc") {
        const diferenciaHoras =
          Number(reporteA.hours_spent ?? 0) - Number(reporteB.hours_spent ?? 0);
        return ordenActual === "horas-desc"
          ? -diferenciaHoras
          : diferenciaHoras;
      }

      const diferenciaFecha =
        getFechaOrdenable(reporteA.created_at) -
        getFechaOrdenable(reporteB.created_at);
      return ordenActual === "fecha-desc" ? -diferenciaFecha : diferenciaFecha;
    });
  }, [ordenActual, reportesFiltrados]);

  const reportesVisibles = useMemo(() => {
    if (!usarColeccionCompleta) return reportesOrdenados;

    const inicio = (page - 1) * pageSize;
    return reportesOrdenados.slice(inicio, inicio + pageSize);
  }, [page, pageSize, reportesOrdenados, usarColeccionCompleta]);

  const resumen = useMemo(
    () => {
      if (usarColeccionCompleta) {
        return reportesFiltrados.reduce(
          (acc, reporte) => {
            acc.total += 1;
            if (reporte.status === "APPROVED") acc.aprobados += 1;
            if (reporte.status === "PENDING") acc.pendientes += 1;
            if (reporte.status === "REJECTED") acc.rechazados += 1;
            return acc;
          },
          { aprobados: 0, pendientes: 0, rechazados: 0, total: 0 },
        );
      }

      return {
        aprobados: dashboardData?.reports?.approved ?? 0,
        pendientes: dashboardData?.reports?.pending ?? 0,
        rechazados: dashboardData?.reports?.rejected ?? 0,
        total: dashboardData?.reports?.total ?? total,
      };
    },
    [dashboardData, reportesFiltrados, total, usarColeccionCompleta],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setBusquedaAplicada(busqueda);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  useEffect(() => {
    if (!usarColeccionCompleta) {
      setReportesBusqueda([]);
      setCargandoBusqueda(false);
      setErrorBusqueda(null);
      return;
    }

    let cancelado = false;

    const cargarReportesBusqueda = async () => {
      setCargandoBusqueda(true);
      setErrorBusqueda(null);

      try {
        let paginaActual = 1;
        let totalPaginas = 1;
        const acumulados = [];

        while (paginaActual <= totalPaginas) {
          const respuesta = await consultarReportes({
            params: {
              page: paginaActual,
              page_size: pageSize,
              ...(estadoFiltro ? { status: estadoFiltro } : {}),
              ...(categoriaFiltro ? { category_id: categoriaFiltro } : {}),
            },
          });

          const itemsPagina = Array.isArray(respuesta?.items)
            ? respuesta.items
            : Array.isArray(respuesta?.data)
              ? respuesta.data
              : Array.isArray(respuesta?.results)
                ? respuesta.results
                : Array.isArray(respuesta)
                  ? respuesta
                  : [];

          acumulados.push(...itemsPagina);

          const totalItems = Number(respuesta?.total ?? acumulados.length);
          totalPaginas = Math.max(1, Math.ceil(totalItems / pageSize));
          paginaActual += 1;
        }

        if (!cancelado) setReportesBusqueda(acumulados);
      } catch (err) {
        if (!cancelado) {
          setErrorBusqueda(err);
          setReportesBusqueda([]);
        }
      } finally {
        if (!cancelado) setCargandoBusqueda(false);
      }
    };

    cargarReportesBusqueda();

    return () => {
      cancelado = true;
    };
  }, [
    categoriaFiltro,
    consultarReportes,
    estadoFiltro,
    pageSize,
    textoBusqueda,
    usarColeccionCompleta,
  ]);

  const resetearPaginacion = () => {
    setPage(1);
  };

  const abrirDetalle = (reporte) => setReporteSeleccionado(reporte);
  const cerrarDetalle = () => setReporteSeleccionado(null);
  const abrirRevision = () => {
    if (!reporteSeleccionado) return;
    setReporteRevisando(reporteSeleccionado);
    cerrarDetalle();
  };
  const cerrarRevision = () => setReporteRevisando(null);

  const guardarRevision = async (payload) => {
    if (!reporteRevisando) return;

    await actualizarReporte({
      url: `/reports/${reporteRevisando.id}/review`,
      body: payload,
      method: "PATCH",
    });

    setToastMensaje("Estado del reporte actualizado exitosamente");
    cerrarRevision();
    await recargarReportes({
      params: paramsConsulta,
    });
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-acc1)]">
              Reportes
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Revision administrativa
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Busca, filtra y revisa reportes desde una vista mas ordenada y
              operativa.
            </p>
          </div>

          <Link className={primaryButtonClass} to="/estudiantes-pendientes">
            Estudiantes en deuda
          </Link>
        </section>

        {!(loading && !data) ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TarjetaEstadistica
              label="Total"
              tone="text-slate-800"
              value={resumen.total}
            />
            <TarjetaEstadistica
              label="Pendientes"
              tone="text-amber-700"
              value={resumen.pendientes}
            />
            <TarjetaEstadistica
              label="Aprobados"
              tone="text-emerald-700"
              value={resumen.aprobados}
            />
            <TarjetaEstadistica
              label="Rechazados"
              tone="text-rose-700"
              value={resumen.rechazados}
            />
          </section>
        ) : null}

        {loading && !data ? <StatsGridSkeleton cards={4} /> : null}

        {loading && !data ? (
          <FiltersSkeleton controls={4} />
        ) : (
          <section className={`${panelBaseClass} !bg-white`}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Buscar
                <input
                  className={controlClass}
                  onChange={(evento) => {
                    setBusqueda(evento.target.value);
                    resetearPaginacion();
                  }}
                  placeholder="Estudiante o categoria"
                  type="text"
                  value={busqueda}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Estado
                <select
                  className={controlClass}
                  onChange={(evento) => {
                    setEstadoFiltro(evento.target.value);
                    resetearPaginacion();
                  }}
                  value={estadoFiltro}
                >
                  {estadoOptions.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Categoria
                <select
                  className={controlClass}
                  onChange={(evento) => {
                    setCategoriaFiltro(evento.target.value);
                    resetearPaginacion();
                  }}
                  value={categoriaFiltro}
                >
                  <option value="">Todas</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={String(categoria.id)}>
                      {categoria.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Ordenar por
                <select
                  className={controlClass}
                  onChange={(evento) => {
                    setOrdenActual(evento.target.value);
                    resetearPaginacion();
                  }}
                  value={ordenActual}
                >
                  <option value="fecha-desc">Mas recientes</option>
                  <option value="fecha-asc">Mas antiguos</option>
                  <option value="horas-desc">Mas horas</option>
                  <option value="horas-asc">Menos horas</option>
                  <option value="estudiante-asc">Estudiante A-Z</option>
                </select>
              </label>
            </div>
          </section>
        )}

        {loading && !data ? <TableSkeleton columns={7} rows={6} /> : null}
        {(error || errorBusqueda) && !loading && !cargandoBusqueda ? (
          <p className="text-red-600">{mensajeError}</p>
        ) : null}

        {!(loading && !data) && !error && !errorBusqueda ? (
          <>
            {/* Vista Tabla */}
            <section
              className={`hidden ${panelBaseClass} overflow-x-auto !bg-white !p-0 md:block`}
            >
              <div className="min-w-[980px]">
                <div className="grid grid-cols-[1.35fr_0.9fr_0.9fr_0.8fr_0.9fr_0.95fr_0.75fr] gap-4 border-b border-slate-100 bg-slate-50/90 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <span>Estudiante</span>
                  <span>Categoria</span>
                  <span>Descripcion</span>
                  <span>Horas</span>
                  <span>Fecha</span>
                  <span>Estado</span>
                  <span>Accion</span>
                </div>

                {cargandoBusqueda ? (
                  <div className="px-6 py-6">
                    <TableSkeleton columns={7} rows={4} />
                  </div>
                ) : reportesVisibles.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {reportesVisibles.map((reporte) => (
                      <div
                        key={reporte.id}
                        className="grid cursor-pointer grid-cols-[1.35fr_0.9fr_0.9fr_0.8fr_0.9fr_0.95fr_0.75fr] items-center gap-4 px-6 py-4 text-sm text-slate-600 transition hover:bg-slate-50/60"
                        onClick={() => abrirDetalle(reporte)}
                        onKeyDown={(evento) => {
                          if (evento.key === "Enter" || evento.key === " ") {
                            evento.preventDefault();
                            abrirDetalle(reporte);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800">
                            {reporte.student?.full_name ?? "Sin estudiante"}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-400">
                            {reporte.student?.email ?? "Sin correo"}
                          </p>
                        </div>
                        <p className="truncate font-medium text-slate-700">
                          {reporte.category?.name ?? "Sin categoria"}
                        </p>
                        <p className="truncate">
                          {reporte.description || "Sin descripcion"}
                        </p>
                        <p className="font-semibold text-slate-800">
                          {formatHoras(reporte.hours_spent)}
                        </p>
                        <p>{formatFecha(reporte.created_at)}</p>
                        <BadgeEstadoReporte estado={reporte.status} />
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="inline-flex items-center justify-center rounded-full bg-[#eef5ff] px-4 py-2 text-xs font-semibold text-[#1958df] transition hover:bg-[#e0ecff]"
                            onClick={(evento) => {
                              evento.stopPropagation();
                              abrirDetalle(reporte);
                            }}
                            type="button"
                          >
                            Ver
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-10 text-sm text-slate-500">
                    No se encontraron reportes para este filtro.
                  </div>
                )}
              </div>
            </section>

            {/* Vista Tarjetas */}
            <section
              className={`md:hidden ${panelBaseClass} !bg-white`}
            >
              {cargandoBusqueda ? (
                <div className="px-4 py-6">
                  <TableSkeleton columns={1} rows={4} />
                </div>
              ) : reportesVisibles.length > 0 ? (
                <div className="space-y-3">
                  {reportesVisibles.map((reporte) => (
                    <div
                      key={reporte.id}
                      className="rounded-[1.4rem] border border-slate-100 bg-slate-50/50 p-4"
                      onClick={() => abrirDetalle(reporte)}
                      onKeyDown={(evento) => {
                        if (evento.key === "Enter" || evento.key === " ") {
                          evento.preventDefault();
                          abrirDetalle(reporte);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800">
                            {reporte.student?.full_name ?? "Sin estudiante"}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-400">
                            {reporte.student?.email ?? "Sin correo"}
                          </p>
                        </div>
                        <BadgeEstadoReporte estado={reporte.status} />
                      </div>

                      <div className="mt-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Actividad</p>
                        <p className="mt-1 text-sm text-slate-600">
                          {reporte.description || "Sin descripcion"}
                        </p>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Categoria</p>
                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {reporte.category?.name ?? "Sin categoria"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Horas</p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {formatHoras(reporte.hours_spent)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-slate-400">
                        {formatFecha(reporte.created_at)}
                      </div>

                      <button
                        className="mt-4 w-full inline-flex items-center justify-center rounded-full bg-[#eef5ff] px-4 py-2 text-xs font-semibold text-[#1958df] transition hover:bg-[#e0ecff]"
                        onClick={(evento) => {
                          evento.stopPropagation();
                          abrirDetalle(reporte);
                        }}
                        type="button"
                      >
                        Ver detalle
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-10 text-sm text-slate-500">
                  No se encontraron reportes para este filtro.
                </div>
              )}
            </section>

            <Paginacion
              onPageChange={setPage}
              page={page}
              page_size={pageSize}
              total={total}
            />
          </>
        ) : null}

        {reporteSeleccionado ? (
          <ReporteDetalleModal
            canReview
            onClose={cerrarDetalle}
            onReview={abrirRevision}
            reporte={reporteSeleccionado}
          />
        ) : null}

        {reporteRevisando ? (
          <ReporteRevisionModal
            loading={guardandoRevision}
            onClose={cerrarRevision}
            onSubmit={guardarRevision}
            reporte={reporteRevisando}
          />
        ) : null}
      </div>
    </PageShell>
  );
}

export default ReportesAdmin;
